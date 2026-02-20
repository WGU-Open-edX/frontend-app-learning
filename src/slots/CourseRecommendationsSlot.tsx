import React from 'react';
import { Slot } from '@openedx/frontend-base';
import CourseRecommendations from '../courseware/course/course-exit/CourseRecommendations';

interface Props {
  variant: string;
}

export const CourseRecommendationsSlot: React.FC<Props> = ({ variant }: Props) => (
  <Slot
    id="org.openedx.frontend.slot.learning.courseRecommendations.v1"
  >
    <CourseRecommendations variant={variant} />
  </Slot>
);

export default CourseRecommendationsSlot;
