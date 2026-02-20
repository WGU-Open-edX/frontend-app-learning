import React from 'react';
import { Slot } from '@openedx/frontend-base';
import NextButton from '../courseware/course/sequence/sequence-navigation/generic/NextButton';

interface Props {
  disabled: boolean;
  buttonText: string | '';
  nextLink: string;
  sequenceId: string;
  onClickHandler: () => void;
  variant: string;
  buttonStyle: string;
  isAtTop: boolean;
}

export const NextUnitTopNavTriggerSlot: React.FC<Props> = ({
  disabled,
  buttonText,
  nextLink,
  sequenceId,
  onClickHandler,
  variant,
  buttonStyle,
  isAtTop,
}) => (
  <Slot
    id="org.openedx.frontend.slot.learning.nextUnitTopNavTrigger.v1"
    disabled={disabled}
    buttonText={buttonText}
    nextLink={nextLink}
    sequenceId={sequenceId}
    onClickHandler={onClickHandler}
    variant={variant}
    buttonStyle={buttonStyle}
    isAtTop={isAtTop}
  >
    <NextButton
      {...{
        variant,
        buttonStyle,
        onClickHandler,
        nextLink,
        disabled,
        buttonText,
        isAtTop,
      }}
    />
  </Slot>
);

export default NextUnitTopNavTriggerSlot;
