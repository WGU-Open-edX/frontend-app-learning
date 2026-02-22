import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import { useEffect, useState, useMemo } from 'react';
import { useXblockCompletion, CompletionConfigs } from './useXblockCompletion';
import { xblockRegistry } from './xblockRegistry';

// Register this component as handling HTML xblocks
xblockRegistry.registerType('html');

export interface XblockProps {
  xblockType: string,
  blockId: string,
  courseId: string,
  unitId: string,
  debugMode?: boolean,
};

export interface XblockContent<TContent = string, TMetadata = XblockContentMetadata> {
  content: TContent,
  content_type: string,
  display_name: string,
  block_id: string,
  block_type: string,
  metadata: TMetadata,
  can_complete_on_view?: boolean,
}

export interface XblockContentMetadata {
  editor_type: string,
  uses_latex: boolean,
}

const HtmlXblock = ({ xblockType, blockId, courseId, unitId, debugMode }: XblockProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [content, setContent] = useState<XblockContent<string, XblockContentMetadata> | null>(null);

  // Initialize completion tracking for HTML blocks (conditionally enabled based on content)
  const completionConfig = useMemo(() => ({
    ...CompletionConfigs.html,
    enabled: content?.can_complete_on_view || false
  }), [content?.can_complete_on_view]);
  const completion = useXblockCompletion(blockId, courseId, unitId, completionConfig);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getAuthenticatedHttpClient().get<XblockContent<string, XblockContentMetadata>>(`${getSiteConfig().lmsBaseUrl}/courses/${courseId}/xblock/${blockId}/handler/get_content`);
        // the images coming from the backend are relative to the media url, so we need to replace them with absolute urls
        const mediaUrl = getSiteConfig().lmsBaseUrl;
        const contentWithAbsoluteUrls = response.data.content.replace(/src="\/assets\//g, `src="${mediaUrl}/assets/`);
        // the html may content iframes with urls that looks like "/asset-v1:OpenedX+DemoX+DemoCourse+type@asset+block@ohms_law.html" which is only missing the lmsBaseUrl, so we need to replace them with absolute urls as well
        const contentWithAbsoluteUrlsAndIframes = contentWithAbsoluteUrls.replace(/src="\/asset-v1:[^"]+"/g, (match) => {
          const url = match.slice(5, -1); // remove src=" and "
          return `src="${mediaUrl}${url}"`;
        });
        // Handle object elements with data attributes (like PDFs)
        const contentWithAbsoluteObjects = contentWithAbsoluteUrlsAndIframes
          .replace(/data="\/assets\//g, `data="${mediaUrl}/assets/`)
          .replace(/data="\/asset-v1:[^"]+"/g, (match) => {
            const url = match.slice(6, -1); // remove data=" and "
            return `data="${mediaUrl}${url}"`;
          });
        // Set the full response data, not just the processed content
        setContent({
          ...response.data,
          content: contentWithAbsoluteObjects
        });
      } catch (error) {
        console.error('Error fetching HTML xblock content:', error);
      }
    };

    // Here you would typically fetch the content for the HTML XBlock using the blockId
    // For this example, we'll just log the blockId to the console
    if (shouldRender) {
      fetchContent();
    }
  }, [blockId, shouldRender, courseId]);

  useEffect(() => {
    if (xblockType === 'html') {
      setShouldRender(true);
    }
  }, [xblockType]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="xblock-student_view html-xblock"
      data-block-id={blockId}
      data-completion-enabled={completionConfig.enabled ? "true" : "false"}
      data-completion-mode={completionConfig.enabled ? "view" : "disabled"}
      data-can-complete-on-view={content?.can_complete_on_view ? "true" : "false"}
      style={{
        position: 'relative',
        border: debugMode && completion.isComplete ? '2px solid #28a745' : 'none',
        borderRadius: debugMode && completion.isComplete ? '4px' : 'none',
        padding: debugMode && completion.isComplete ? '8px' : '0'
      }}
    >
      {/* Completion status indicator */}
      {debugMode && completionConfig.enabled && completion.isComplete && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#28a745',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 1000
          }}
        >
          ✓ Complete
        </div>
      )}

      {/* Loading indicator for completion */}
      {debugMode && completionConfig.enabled && completion.isSubmitting && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: completion.isComplete ? '120px' : '8px',
            background: '#007bff',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            zIndex: 1000
          }}
        >
          Marking complete...
        </div>
      )}

      {/* Error indicator */}
      {debugMode && completionConfig.enabled && completion.error && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#dc3545',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            zIndex: 1000
          }}
        >
          ⚠ Completion Error
        </div>
      )}

      {/* Completion disabled indicator (for debugging) */}
      {debugMode && !completionConfig.enabled && content && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#6c757d',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            opacity: 0.7,
            zIndex: 1000
          }}
        >
          Completion disabled
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: content?.content || `<p>Loading content for ${blockId}...</p>` }} />
    </div>
  );
};

export default HtmlXblock;
