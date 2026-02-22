import React, { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';

const ProgressTabCourseGradeSlot = ({ courseId, children }: {
  courseId: string;
  children: ReactNode;
}) => (
  <Slot
    id="org.openedx.frontend.slot.learning.progressTabCourseGrade.v1"
    courseId={courseId}
  >
    {children}
  </Slot>
);

export default ProgressTabCourseGradeSlot;
