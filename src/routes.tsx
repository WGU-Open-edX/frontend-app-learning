import React from 'react';
import { Navigate } from 'react-router';
import { fetchDiscussionTab, fetchLiveTab } from './course-home/data/thunks';
import DiscussionTab from './course-home/discussion-tab/DiscussionTab';
import DatesTab from './course-home/dates-tab';
import GoalUnsubscribe from './course-home/goal-unsubscribe';
import OutlineTab from './course-home/outline-tab';
import ProgressTab from './course-home/progress-tab/ProgressTab';
import CoursewareContainer from './courseware';
import { CourseExit } from './courseware/course/course-exit';
import CoursewareRedirectLandingPage from './courseware/CoursewareRedirectLandingPage';
import { TabContainer } from './tab-page';
import { DECODE_ROUTES, ROUTES } from './constants';
import { fetchDatesTab, fetchOutlineTab, fetchProgressTab } from './course-home/data';
import LiveTab from './course-home/live-tab/LiveTab';
import { fetchCourse } from './courseware/data';
import DecodePageRoute from './decode-page-route';
import CourseAccessErrorPage from './generic/CourseAccessErrorPage';
import PageNotFound from './generic/PageNotFound';
import PreferencesUnsubscribe from './preferences-unsubscribe';
import Main from './Main';

const routes = [
  {
    id: 'org.openedx.frontend.route.learning.main',
    path: '/learning',
    Component: Main,
    children: [
      {
        path: '*',
        element: <PageNotFound />,
      },
      {
        path: ROUTES.UNSUBSCRIBE,
        element: <GoalUnsubscribe />,
      },
      {
        path: ROUTES.REDIRECT,
        element: <CoursewareRedirectLandingPage />,
      },
      {
        path: ROUTES.PREFERENCES_UNSUBSCRIBE,
        element: <PreferencesUnsubscribe />,
      },
      {
        path: DECODE_ROUTES.ACCESS_DENIED,
        element: (
          <DecodePageRoute>
            <CourseAccessErrorPage />
          </DecodePageRoute>
        ),
      },
      {
        path: DECODE_ROUTES.HOME,
        element: (
          <DecodePageRoute>
            <TabContainer tab="outline" fetch={fetchOutlineTab} slice="courseHome">
              <OutlineTab />
            </TabContainer>
          </DecodePageRoute>
        ),
      },
      {
        path: DECODE_ROUTES.LIVE,
        element: (
          <DecodePageRoute>
            <TabContainer tab="lti_live" fetch={fetchLiveTab} slice="courseHome">
              <LiveTab />
            </TabContainer>
          </DecodePageRoute>
        ),
      },
      {
        path: DECODE_ROUTES.DATES,
        element: (
          <DecodePageRoute>
            <TabContainer tab="dates" fetch={fetchDatesTab} slice="courseHome">
              <DatesTab />
            </TabContainer>
          </DecodePageRoute>
        ),
      },
      {
        path: DECODE_ROUTES.DISCUSSION,
        element: (
          <DecodePageRoute>
            <TabContainer tab="discussion" fetch={fetchDiscussionTab} slice="courseHome">
              <DiscussionTab />
            </TabContainer>
          </DecodePageRoute>
        ),
      },
      ...DECODE_ROUTES.PROGRESS.map((route) => ({
        path: route,
        element: (
          <DecodePageRoute>
            <TabContainer
              tab="progress"
              fetch={fetchProgressTab}
              slice="courseHome"
              isProgressTab
            >
              <ProgressTab />
            </TabContainer>
          </DecodePageRoute>
        ),
      })),
      {
        path: DECODE_ROUTES.COURSE_END,
        element: (
          <DecodePageRoute>
            <TabContainer tab="courseware" fetch={fetchCourse} slice="courseware">
              <CourseExit />
            </TabContainer>
          </DecodePageRoute>
        ),
      },
      ...DECODE_ROUTES.COURSEWARE.map((route) => ({
        path: route,
        element: (
          <DecodePageRoute>
            <CoursewareContainer />
          </DecodePageRoute>
        ),
      })),
    ],
  },
];

export default routes;
