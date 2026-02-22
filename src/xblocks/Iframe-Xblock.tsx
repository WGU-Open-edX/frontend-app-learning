import { getSiteConfig } from '@openedx/frontend-base';
import { XblockProps } from '@src/xblocks/Html-Xblock';
import * as hooks from '../courseware/course/sequence/Unit/hooks';
import { ContentIFrameLoaderSlot } from '../slots/ContentIFrameLoaderSlot';
import { ContentIFrameErrorSlot } from '../slots/ContentIFrameErrorSlot';
import { IFRAME_FEATURE_POLICY } from '../courseware/course/sequence/Unit/ContentIFrame';
import { xblockRegistry } from './xblockRegistry';

const IframeXblock = ({ xblockType, blockId, courseId }: XblockProps) => {
  // Only render for xblock types that aren't handled by specific components
  if (xblockRegistry.isTypeHandled(xblockType)) {
    return null;
  }

  const siteConfig = getSiteConfig();
  const iframeUrl = `${siteConfig.lmsBaseUrl}/xblock/${blockId}?view=student_view`;
  
  const {
    handleIFrameLoad,
    hasLoaded,
    iframeHeight,
    showError,
  } = hooks.useIFrameBehavior({
    elementId: `iframe-xblock-${blockId}`,
    id: blockId,
    iframeUrl,
    onLoaded: () => {},
  });

  const contentIFrameProps = {
    id: `iframe-xblock-${blockId}`,
    src: iframeUrl,
    allow: IFRAME_FEATURE_POLICY,
    allowFullScreen: true,
    height: iframeHeight,
    scrolling: 'no' as const,
    referrerPolicy: 'origin' as const,
    onLoad: handleIFrameLoad,
  };

  return (
    <div 
      className="xblock-student_view iframe-xblock" 
      data-block-id={blockId}
      data-block-type={xblockType}
      style={{ margin: '20px 0' }}
    >
      <div style={{ 
        marginBottom: '8px', 
        fontSize: '14px', 
        color: '#666',
        fontWeight: 'bold'
      }}>
        {xblockType.charAt(0).toUpperCase() + xblockType.slice(1)} Block
      </div>
      
      {/* Loading and error handling */}
      {!hasLoaded && (
        showError ? (
          <ContentIFrameErrorSlot courseId={courseId} />
        ) : (
          <ContentIFrameLoaderSlot courseId={courseId} loadingMessage="Loading content..." />
        )
      )}
      
      {/* Enhanced iframe with EdX functionality */}
      <div className="unit-iframe-wrapper">
        <iframe
          title={`XBlock ${blockId} (${xblockType})`}
          {...contentIFrameProps}
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default IframeXblock;