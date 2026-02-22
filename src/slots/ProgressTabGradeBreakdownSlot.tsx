import React from 'react';
import { Slot } from '@openedx/frontend-base';
import { useModel } from '../generic/model-store';
import DetailedGrades from '../course-home/progress-tab/grades/detailed-grades/DetailedGrades';
import GradeSummary from '../course-home/progress-tab/grades/grade-summary/GradeSummary';
import { useContextId } from '../data/hooks';

const ProgressTabGradeBreakdownSlot = () => {
  const courseId = useContextId();
  const { gradesFeatureIsFullyLocked } = useModel('progress', courseId);
  const applyLockedOverlay = gradesFeatureIsFullyLocked ? 'locked-overlay' : '';
  return (
    <Slot
      id="org.openedx.frontend.slot.learning.progressTabGradeBreakdown.v1"
    >
      <div
        className={`grades my-4 p-4 rounded raised-card ${applyLockedOverlay}`}
        aria-hidden={gradesFeatureIsFullyLocked}
      >
        <GradeSummary />
        <DetailedGrades />
      </div>
    </Slot>
  );
};

export default ProgressTabGradeBreakdownSlot;

