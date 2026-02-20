import React from 'react';
import { Slot } from '@openedx/frontend-base';
import LockPaywall from '../courseware/course/sequence/lock-paywall';

export const GatedUnitContentMessageSlot = ({
  courseId,
}: GatedUnitContentMessageSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.learning.gatedUnitContentMessage.v1"
    courseId={courseId}
  >
    <LockPaywall courseId={courseId} />
  </Slot>
);

interface GatedUnitContentMessageSlotProps {
  courseId: string;
}

export default GatedUnitContentMessageSlot;
