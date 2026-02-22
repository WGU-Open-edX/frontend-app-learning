import React, { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';

const ProgressTabCertificateStatusMainBodySlot = ({ courseId, children }: {
  courseId: string;
  children: ReactNode;
}) => (
  <Slot
    id="org.openedx.frontend.slot.learning.progressTabCertificateStatusMainBody.v1"
    courseId={courseId}
  >
    {children}
  </Slot>
);

export default ProgressTabCertificateStatusMainBodySlot;
