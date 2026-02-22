import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useIntl } from '@openedx/frontend-base';

import { GetCourseExitNavigation } from '../../course-exit';

import { useSequenceNavigationMetadata } from './hooks';
import messages from './messages';
import PreviousButton from './generic/PreviousButton';
import NextButton from './generic/NextButton';
import { NextUnitTopNavTriggerSlot } from '../../../../slots/NextUnitTopNavTriggerSlot';

const UnitNavigation = ({
  sequenceId,
  unitId = null,
  onClickPrevious,
  onClickNext,
  isAtTop = false,
  courseId,
}) => {
  const intl = useIntl();
  const {
    isFirstUnit, isLastUnit, nextLink, previousLink,
  } = useSequenceNavigationMetadata(sequenceId, unitId);

  const renderPreviousButton = () => {
    const buttonStyle = `previous-button ${isAtTop ? 'text-dark mr-3' : 'justify-content-center'}`;
    return (
      <PreviousButton
        isFirstUnit={isFirstUnit}
        variant="outline-secondary"
        buttonLabel={intl.formatMessage(messages.previousButton)}
        buttonStyle={buttonStyle}
        onClick={onClickPrevious}
        previousLink={previousLink}
        isAtTop={isAtTop}
      />
    );
  };

  const renderNextButton = () => {
    const { exitActive, exitText } = GetCourseExitNavigation(courseId, intl);
    const buttonText = (isLastUnit && exitText) ? exitText : intl.formatMessage(messages.nextButton);
    const disabled = isLastUnit && !exitActive;
    const variant = 'outline-primary';
    const buttonStyle = `next-button ${isAtTop ? 'text-dark' : 'justify-content-center'}`;

    if (isAtTop) {
      return (
        <NextUnitTopNavTriggerSlot
          {...{
            variant,
            buttonStyle,
            buttonText,
            disabled,
            sequenceId,
            nextLink,
            onClickHandler: onClickNext,
            isAtTop,
          }}
        />
      );
    }

    return (
      <NextButton
        variant={variant}
        buttonStyle={buttonStyle}
        onClickHandler={onClickNext}
        disabled={disabled}
        buttonText={buttonText}
        nextLink={nextLink}
        hasEffortEstimate
        isAtTop={isAtTop}
        sequenceId={sequenceId}
        unitId={unitId}
      />
    );
  };

  return (
    <div className={classNames('d-flex', {
      'unit-navigation': !isAtTop,
      'top-unit-navigation': isAtTop,
    })}
    >
      {renderPreviousButton()}
      {renderNextButton()}
    </div>
  );
};

UnitNavigation.propTypes = {
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  onClickPrevious: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  isAtTop: PropTypes.bool,
};



export default UnitNavigation;
