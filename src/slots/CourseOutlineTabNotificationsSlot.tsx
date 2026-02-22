import React from 'react';
import { Slot } from '@openedx/frontend-base';

export const CourseOutlineTabNotificationsSlot = ({
  courseId,
}: CourseOutlineTabNotificationsSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.learning.courseOutlineTabNotifications.v1"
    courseId={courseId}
    model="outline"
  />
);

interface CourseOutlineTabNotificationsSlotProps {
  courseId: string;
}

export default CourseOutlineTabNotificationsSlot;
