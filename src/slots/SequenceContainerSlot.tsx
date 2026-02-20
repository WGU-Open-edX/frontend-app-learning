import React, { ReactNode } from 'react';
import { Slot } from '@openedx/frontend-base';

const SequenceContainerSlot = ({ children }: { children: ReactNode }) => (
  <Slot
    id="org.openedx.frontend.slot.learning.sequenceContainer.v1"
  >
    {children}
  </Slot>
);

export default SequenceContainerSlot;
