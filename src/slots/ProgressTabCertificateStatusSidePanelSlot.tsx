import React, { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';

const ProgressTabCertificateStatusSidePanelSlot = ({ courseId, children }: {
  courseId: string;
  children: ReactNode;
}) => (
  <Slot
    id="org.openedx.frontend.slot.learning.progressTabCertificateStatusSidePanel.v1"
    courseId={courseId}
  >
    {children}
  </Slot>
);

export default ProgressTabCertificateStatusSidePanelSlot;
