import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';

import SidebarTriggers from './courseware/course/sidebar/SidebarTriggers';
import Sidebar from './courseware/course/sidebar/Sidebar';
import { Sidebar as CourseOutlineSidebar, Trigger as CourseOutlineTrigger } from './courseware/course/sidebar/sidebars/course-outline';
import HtmlXblock from '@src/xblocks/Html-Xblock';
import VideoXblock from '@src/xblocks/Video-Xblock';
import IframeXblock from '@src/xblocks/Iframe-Xblock';

// Register sidebar plugins for the slots
const slots: SlotOperation[] = [
  {
    slotId: 'org.openedx.frontend.slot.learning.notificationsDiscussionsSidebarTrigger.v1',
    op: WidgetOperationTypes.APPEND,
    id: 'sidebar-triggers',
    component: SidebarTriggers,
  },
  {
    slotId: 'org.openedx.frontend.slot.learning.notificationsDiscussionsSidebar.v1',
    op: WidgetOperationTypes.APPEND,
    id: 'sidebar-content',
    component: Sidebar,
  },
  {
    slotId: 'org.openedx.frontend.slot.learning.courseOutlineSidebarTrigger.v1',
    op: WidgetOperationTypes.APPEND,
    id: 'outline-trigger',
    component: CourseOutlineTrigger,
  },
  {
    slotId: 'org.openedx.frontend.slot.learning.courseOutlineSidebar.v1',
    op: WidgetOperationTypes.APPEND,
    id: 'outline-sidebar',
    component: CourseOutlineSidebar,
  },
  {
    slotId: 'org.openedx.frontend.slot.learning.xblock.v1',
    op: WidgetOperationTypes.APPEND,
    id: 'content-xblock-video',
    component: VideoXblock,
  },
  {
    slotId: 'org.openedx.frontend.slot.learning.xblock.v1',
    op: WidgetOperationTypes.APPEND,
    id: 'content-xblock-html',
    component: HtmlXblock,
  },
  {
    slotId: 'org.openedx.frontend.slot.learning.xblock.v1',
    op: WidgetOperationTypes.APPEND,
    id: 'content-xblock-iframe',
    component: IframeXblock,
  }
];

export default slots;
