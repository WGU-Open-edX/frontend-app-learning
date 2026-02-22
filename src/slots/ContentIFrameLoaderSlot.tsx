import React, { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';
import PageLoading from '../generic/PageLoading';

export const ContentIFrameLoaderSlot = ({
  courseId,
  loadingMessage,
}: ContentIFrameLoaderSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.learning.contentIFrameLoader.v1"
    defaultLoaderComponent={<PageLoading srMessage={loadingMessage} />}
    courseId={courseId}
  >
    <PageLoading srMessage={loadingMessage} />
  </Slot>
);

interface ContentIFrameLoaderSlotProps {
  courseId: string,
  loadingMessage: ReactNode,
}

export default ContentIFrameLoaderSlot;
