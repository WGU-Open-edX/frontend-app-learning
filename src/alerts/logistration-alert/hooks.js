/* eslint-disable import/prefer-default-export */
import React, { useContext } from 'react';
import { SiteContext } from '@openedx/frontend-base';
import { ALERT_TYPES, useAlert } from '../../generic/user-messages';
import { useModel } from '../../generic/model-store';

const LogistrationAlert = React.lazy(() => import('./LogistrationAlert'));

export function useLogistrationAlert(courseId) {
  const { authenticatedUser } = useContext(SiteContext);
  const outline = useModel('outline', courseId);
  const privateOutline = outline && outline.courseBlocks && !outline.courseBlocks.courses;
  /**
   * This alert should render if
   *    1. the user is not authenticated, AND
   *    2. the course is private.
   */
  const isVisible = authenticatedUser === null && privateOutline;

  useAlert(isVisible, {
    code: 'clientLogistrationAlert',
    topic: 'outline',
    dismissible: false,
    type: ALERT_TYPES.ERROR,
  });

  return { clientLogistrationAlert: LogistrationAlert };
}
