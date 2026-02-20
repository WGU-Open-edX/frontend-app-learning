import { getSiteConfig, useIntl } from '@openedx/frontend-base';
import classNames from 'classnames';
import { useContext } from 'react';

import { useModel } from '@src/generic/model-store';
import SidebarBase from '../../common/SidebarBase';
import SidebarContext from '../../SidebarContext';
import { ID } from './DiscussionsTrigger';

import messages from './messages';

const DiscussionsSidebar = () => {
  const intl = useIntl();
  const {
    unitId,
    courseId,
    shouldDisplayFullScreen,
  } = useContext(SidebarContext);
  const topic = useModel('discussionTopics', unitId);
  const discussionsUrl = `${getSiteConfig().DISCUSSIONS_MFE_BASE_URL}/${courseId}/category/${unitId}`;

  if (!topic?.id || !topic?.enabledInContext) {
    return null;
  }

  return (
    <SidebarBase
      title={intl.formatMessage(messages.discussionsTitle)}
      ariaLabel={intl.formatMessage(messages.discussionsTitle)}
      sidebarId={ID}
      width="45rem"
      showTitleBar={false}
      className={classNames({
        'ml-4': !shouldDisplayFullScreen,
      })}
    >
      <iframe
        src={`${discussionsUrl}?inContextSidebar`}
        className="d-flex sticky-top vh-100 w-100 border-0 discussions-sidebar-frame"
        title={intl.formatMessage(messages.discussionsTitle)}
        allow="clipboard-write"
        loading="lazy"
      />
    </SidebarBase>
  );
};

DiscussionsSidebar.Trigger = DiscussionsSidebar;
DiscussionsSidebar.ID = ID;

export default DiscussionsSidebar;
