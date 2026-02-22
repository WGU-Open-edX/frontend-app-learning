import React from 'react';
import classNames from 'classnames';
import { useIntl } from '@openedx/frontend-base';
import { CourseTabLinksSlot } from '../slots/CourseTabLinksSlot';
import { CoursewareSearch, CoursewareSearchToggle } from '../course-home/courseware-search';
import { useCoursewareSearchState } from '../course-home/courseware-search/hooks';

import Tabs from '../generic/tabs/Tabs';
import messages from './messages';

interface CourseTabsNavigationProps {
  activeTabSlug?: string,
  className?: string | null,
  tabs: {
    title: string,
    slug: string,
    url: string,
  }[],
}

const CourseTabsNavigation = ({
  activeTabSlug = undefined,
  className = null,
  tabs,
}: CourseTabsNavigationProps) => {
  const intl = useIntl();
  const { show } = useCoursewareSearchState();

  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation', className)}>
      <div className="container-xl">
        <div className="nav-bar">
          <div className="nav-menu">
            <Tabs
              className="nav-underline-tabs"
              aria-label={intl.formatMessage(messages.courseMaterial)}
            >
              {/* @ts-expect-error: JS component interop */}
              <CourseTabLinksSlot tabs={tabs} activeTabSlug={activeTabSlug} />
            </Tabs>
          </div>
          <div className="search-toggle">
            <CoursewareSearchToggle />
          </div>
        </div>
      </div>
      {show && <CoursewareSearch />}
    </div>
  );
};

export default CourseTabsNavigation;
