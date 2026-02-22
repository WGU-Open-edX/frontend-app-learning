import React from 'react';
import { Slot } from '@openedx/frontend-base';

interface Props {
  courseId: string;
  sectionId?: string;
  sequenceId?: string;
  unitId?: string;
  isStaff?: boolean;
}

export const CourseBreadcrumbsSlot: React.FC<Props> = ({
  courseId, sectionId, sequenceId, unitId, isStaff,
}) => (
  <Slot
    id="org.openedx.frontend.slot.learning.courseBreadcrumbs.v1"
    courseId={courseId}
    sectionId={sectionId}
    sequenceId={sequenceId}
    unitId={unitId}
    isStaff={isStaff}
  />
);

export default CourseBreadcrumbsSlot;
