import React from 'react';
import { Slot } from '@openedx/frontend-base';

interface Props {
  courseId: string;
  unitId?: string;
}

export const NotificationsDiscussionsSidebarTriggerSlot: React.FC<Props> = ({ courseId, unitId }) => (
  <Slot
    id="org.openedx.frontend.slot.learning.notificationsDiscussionsSidebarTrigger.v1"
    courseId={courseId}
    unitId={unitId}
  />
);

export default NotificationsDiscussionsSidebarTriggerSlot;
