import React from 'react';
import { Slot } from '@openedx/frontend-base';
import { CourseTabLinksList } from '../course-tabs/CourseTabLinksList';

type CourseTabList = {
  title: string,
  slug: string,
  url: string,
}[];

export const CourseTabLinksSlot = ({ tabs, activeTabSlug }: {
  tabs: CourseTabList,
  activeTabSlug?: string,
}) => (
  <Slot
    id="org.openedx.frontend.slot.learning.courseTabLinks.v1"
    activeTabSlug={activeTabSlug}
  >
    <CourseTabLinksList tabs={tabs} activeTabSlug={activeTabSlug} />
  </Slot>
);

export default CourseTabLinksSlot;
