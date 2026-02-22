import React from 'react';
import { getSiteConfig, useIntl, Slot } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from '../courseware/course/course-exit/messages';

interface Props {
  href: string;
}

const ViewCoursesLink: React.FC<Props> = ({ href }: Props) => {
  const intl = useIntl();
  return (
    <div className="row w-100 mt-2 mb-4 justify-content-end">
      <Button
        variant="outline-primary"
        href={href}
      >
        {intl.formatMessage(messages.viewCoursesButton)}
      </Button>
    </div>
  );
};

export const CourseExitViewCoursesPluginSlot: React.FC = () => {
  const href = `${getSiteConfig().lmsBaseUrl}/dashboard`;
  return (
    <Slot
      id="org.openedx.frontend.slot.learning.courseExitViewCourses.v1"
    >
      <ViewCoursesLink href={href} />
    </Slot>
  );
};

export default CourseExitViewCoursesPluginSlot;
