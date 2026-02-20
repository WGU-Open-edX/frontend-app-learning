import React from 'react';
import { Slot } from '@openedx/frontend-base';

interface Props {
  courseId: string;
}

export const CourseHomeSectionOutlineSlot: React.FC<Props> = ({ courseId }) => (
  <Slot
    id="org.openedx.frontend.slot.learning.courseHomeSectionOutline.v1"
    courseId={courseId}
  />
);

export default CourseHomeSectionOutlineSlot;
