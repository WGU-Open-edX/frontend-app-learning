import React from 'react';
import { Slot } from '@openedx/frontend-base';

const SequenceNavigationSlot = ({
  sequenceId,
  unitId,
  nextHandler,
  onNavigate,
  previousHandler,
}: SequenceNavigationSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.learning.sequenceNavigation.v1"
    sequenceId={sequenceId}
    unitId={unitId}
    nextHandler={nextHandler}
    onNavigate={onNavigate}
    previousHandler={previousHandler}
  />
);

interface SequenceNavigationSlotProps {
  sequenceId: string;
  unitId: string;
  nextHandler: () => void;
  onNavigate: () => void;
  previousHandler: () => void;
}

export default SequenceNavigationSlot;

