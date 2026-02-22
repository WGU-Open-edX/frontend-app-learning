import React, { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';

const ProgressCertificateStatusSlot = ({ courseId, children }: ProgressCertificateStatusSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.learning.progressCertificateStatus.v1"
    courseId={courseId}
  >
    {children}
  </Slot>
);

interface ProgressCertificateStatusSlotProps {
  courseId: string;
  children: ReactNode;
}

export default ProgressCertificateStatusSlot;
