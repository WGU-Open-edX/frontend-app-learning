import PropTypes from 'prop-types';

import { ModalDialog } from '@openedx/paragon';
import { ContentIFrameLoaderSlot } from '../../../../slots/ContentIFrameLoaderSlot';
import { ContentIFrameErrorSlot } from '../../../../slots/ContentIFrameErrorSlot';
import { getAuthenticatedHttpClient, getSiteConfig, SiteContext, Slot } from '@openedx/frontend-base';

import * as hooks from './hooks';
import PageLoading from '@src/generic/PageLoading';
import { useContext, useEffect, useState } from 'react';

/**
 * Feature policy for iframe, allowing access to certain courseware-related media.
 *
 * We must use the wildcard (*) origin for each feature, as courseware content
 * may be embedded in external iframes. Notably, xblock-lti-consumer is a popular
 * block that iframes external course content.

 * This policy was selected in conference with the edX Security Working Group.
 * Changes to it should be vetted by them (security@edx.org).
 */
export const IFRAME_FEATURE_POLICY = (
  'microphone *; camera *; midi *; geolocation *; encrypted-media *; clipboard-write *; autoplay *'
);

export const testIDs = {
  contentIFrame: 'content-iframe-test-id',
  modalIFrame: 'modal-iframe-test-id',
};

const ContentIFrame = ({
  iframeUrl = null,
  shouldShowContent,
  loadingMessage,
  id,
  elementId,
  onLoaded = () => ({}),
  title,
  courseId = '',
}) => {
  const {
    handleIFrameLoad,
    hasLoaded,
    iframeHeight,
    showError,
  } = hooks.useIFrameBehavior({
    elementId,
    id,
    iframeUrl,
    onLoaded,
  });

  const { authenticatedUser } = useContext(SiteContext);

  const [blocksInUnit, setBlocksInUnit] = useState([]);
  const [debugMode, setDebugMode] = useState(false);

  // let's fetch the content and log it
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const username = authenticatedUser ? authenticatedUser.username : '';
        const response = await getAuthenticatedHttpClient().get(`${getSiteConfig().lmsBaseUrl}/api/courses/v1/blocks/${id}/?depth=1&username=${username}`)
        setBlocksInUnit(response.data.blocks);

      } catch (error) {
        console.error('Error fetching content for unit:', error);
      }
    };

    fetchContent();
  }, [id]);

  const contentIFrameProps = {
    id: elementId,
    src: iframeUrl,
    allow: IFRAME_FEATURE_POLICY,
    allowFullScreen: true,
    height: iframeHeight,
    scrolling: 'no',
    referrerPolicy: 'origin',
    onLoad: handleIFrameLoad,
  };

  return (
    <>
      {blocksInUnit && Object.values(blocksInUnit).map(block => (
        block.type != 'vertical' && (<Slot
          key={block.id}
          id="org.openedx.frontend.slot.learning.xblock.v1"
          xblockType={block.type}
          blockId={block.id}
          courseId={courseId}
          unitId={id}
          debugMode={debugMode}
        >
          {debugMode && (<div>
            Block type: {block.type}
          </div>)}
        </Slot>)
      ))}
    </>
  );
};

ContentIFrame.propTypes = {
  iframeUrl: PropTypes.string,
  id: PropTypes.string.isRequired,
  shouldShowContent: PropTypes.bool.isRequired,
  loadingMessage: PropTypes.node.isRequired,
  elementId: PropTypes.string.isRequired,
  onLoaded: PropTypes.func,
  title: PropTypes.node.isRequired,
  courseId: PropTypes.string,
};



export default ContentIFrame;
