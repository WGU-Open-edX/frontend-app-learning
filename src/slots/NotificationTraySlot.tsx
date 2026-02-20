import React from 'react';
import { Slot } from '@openedx/frontend-base';

interface Props {
  courseId: string;
}

export const NotificationTraySlot: React.FC<Props> = ({ courseId }) => (
  <Slot
    id="org.openedx.frontend.slot.learning.notificationTray.v1"
    courseId={courseId}
  />
);

export default NotificationTraySlot;
