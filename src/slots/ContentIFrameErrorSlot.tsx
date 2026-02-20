import React from 'react';
import { Slot, ErrorPage } from '@openedx/frontend-base';

interface Props {
  courseId: string;
}

export const ContentIFrameErrorSlot: React.FC<Props> = ({ courseId }: Props) => (
  <Slot
    id="org.openedx.frontend.slot.learning.contentIFrameError.v1"
    courseId={courseId}
  >
    <ErrorPage />
  </Slot>
);

export default ContentIFrameErrorSlot;
