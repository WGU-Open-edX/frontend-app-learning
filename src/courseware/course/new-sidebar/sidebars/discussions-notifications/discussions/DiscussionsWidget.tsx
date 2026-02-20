import { useContext } from 'react';

import { getSiteConfig, useIntl } from '@openedx/frontend-base';
import classNames from 'classnames';

import SidebarContext from '../../../SidebarContext';
import messages from '../../../messages';

const DiscussionsWidget = () => {
  const intl = useIntl();
  const {
    unitId,
    courseId,
    hideDiscussionbar,
    isDiscussionbarAvailable,
    shouldDisplayFullScreen,
  } = useContext(SidebarContext);
  const discussionsUrl = `${(getSiteConfig() as any).DISCUSSIONS_MFE_BASE_URL || ''}/${courseId}/category/${unitId}`;

  if (hideDiscussionbar || !isDiscussionbarAvailable) { return null; }

  return (
    <iframe
      src={`${discussionsUrl}?inContextSidebar`}
      className={classNames('d-flex w-100 flex-fill border border-light-400 rounded-sm', {
        'vh-100': !shouldDisplayFullScreen,
        'min-height-700': shouldDisplayFullScreen,
      })}
      title={intl.formatMessage(messages.discussionsTitle)}
      allow="clipboard-write"
      loading="lazy"
    />
  );
};

export default DiscussionsWidget;
