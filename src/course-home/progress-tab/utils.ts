import { getSiteConfig } from '@openedx/frontend-base';

/* eslint-disable import/prefer-default-export */
export const showUngradedAssignments = () => {
  // TODO: Add SHOW_UNGRADED_ASSIGNMENT_PROGRESS to site config when available
  const config = getSiteConfig() as any;
  return config.SHOW_UNGRADED_ASSIGNMENT_PROGRESS === 'true'
    || config.SHOW_UNGRADED_ASSIGNMENT_PROGRESS === true
    || false; // fallback to false
};

export const getLatestDueDateInFuture = (assignmentTypeGradeSummary) => {
  let latest = null;
  assignmentTypeGradeSummary.forEach((assignment) => {
    const assignmentLastGradePublishDate = assignment.lastGradePublishDate;
    if (assignmentLastGradePublishDate && (!latest || new Date(assignmentLastGradePublishDate) > new Date(latest))
       && new Date(assignmentLastGradePublishDate) > new Date()) {
      latest = assignmentLastGradePublishDate;
    }
  });
  return latest;
};
