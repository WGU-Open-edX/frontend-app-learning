import React from 'react';
import { Slot, useIntl } from '@openedx/frontend-base';
import { BookmarkButton } from '../courseware/course/bookmark';
import messages from '../courseware/course/sequence/messages';

interface Unit {
  id: string,
  bookmarked: boolean,
  title: string,
  bookmarkedUpdateState: string,
}

const UnitTitleSlot = ({
  unitId,
  unit,
  renderUnitNavigation,
}: UnitTitleSlotProps) => {
  const { formatMessage } = useIntl();
  const isProcessing = unit.bookmarkedUpdateState === 'loading';

  return (
    <Slot
      id="org.openedx.frontend.slot.learning.unitTitle.v1"
      unitId={unitId}
      unit={unit}
      isEnabledOutlineSidebar={true}
      renderUnitNavigation={renderUnitNavigation}
    >
      <div className="d-flex justify-content-between">
        <div className="mb-0">
          <h3 className="h3">{unit.title}</h3>
        </div>
        {renderUnitNavigation(true)}
      </div>
      <p className="sr-only">{formatMessage(messages.headerPlaceholder)}</p>
      <BookmarkButton
        unitId={unit.id}
        isBookmarked={unit.bookmarked}
        isProcessing={isProcessing}
      />
    </Slot>
  );
};

interface UnitTitleSlotProps {
  unitId: string;
  unit: Unit;
  renderUnitNavigation: (arg: boolean) => React.ReactElement;
}

export default UnitTitleSlot;

