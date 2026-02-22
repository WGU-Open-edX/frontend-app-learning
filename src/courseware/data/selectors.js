import { createSelector } from 'reselect';
import { LOADED } from '@src/constants';

export const sequenceIdsSelector = createSelector(
  [
    state => state.courseware.courseStatus,
    state => state.courseware.courseId,
    state => state.models.coursewareMeta,
    state => state.models.sections,
  ],
  (courseStatus, courseId, coursewareMeta, sections) => {
    if (courseStatus !== LOADED) {
      return [];
    }
    const { sectionIds = [] } = coursewareMeta[courseId] || {};

    return sectionIds
      .flatMap(sectionId => sections[sectionId]?.sequenceIds || []);
  }
);

export const getSequenceId = state => state.courseware.sequenceId;

export const getCourseOutline = state => state.courseware.courseOutline;

export const getCourseOutlineStatus = state => state.courseware.courseOutlineStatus;

export const getSequenceStatus = state => state.courseware.sequenceStatus;

export const getCoursewareOutlineSidebarSettings = state => state.courseware.coursewareOutlineSidebarSettings;

export const getCourseOutlineShouldUpdate = state => state.courseware.courseOutlineShouldUpdate;
