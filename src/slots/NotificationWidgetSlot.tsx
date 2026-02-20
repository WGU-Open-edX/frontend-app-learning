import React from 'react';
import { Slot } from '@openedx/frontend-base';
import { UpgradeNotificationState } from '../courseware/course/new-sidebar/SidebarContext';

export const NotificationWidgetSlot = ({
  courseId,
  notificationCurrentState,
  setNotificationCurrentState,
  toggleSidebar,
}: NotificationWidgetSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.learning.notificationWidget.v1"
    courseId={courseId}
    model="coursewareMeta"
    notificationCurrentState={notificationCurrentState}
    setNotificationCurrentState={setNotificationCurrentState}
    toggleSidebar={toggleSidebar}
  />
);

interface NotificationWidgetSlotProps {
  courseId: string;
  notificationCurrentState: UpgradeNotificationState;
  setNotificationCurrentState: React.Dispatch<UpgradeNotificationState>;
  toggleSidebar: () => void;
}

export default NotificationWidgetSlot;
