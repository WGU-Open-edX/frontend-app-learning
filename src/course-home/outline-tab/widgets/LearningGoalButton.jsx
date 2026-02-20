import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@openedx/frontend-base';
// These flag svgs are derivatives of the Flag icon from paragon
import FlagIntenseIcon from './flag_black.svg';
import FlagCasualIcon from './flag_outline.svg';
import FlagRegularIcon from './flag_gray.svg';
import FlagButton from './FlagButton';
import messages from '../messages';

const LearningGoalButton = ({
  level,
  isSelected,
  handleSelect,
}) => {
  const intl = useIntl();
  const buttonDetails = {
    casual: {
      daysPerWeek: 1,
      title: messages.casualGoalButtonTitle,
      text: messages.casualGoalButtonText,
      icon: <img src={FlagCasualIcon} alt={intl.formatMessage(messages.casualGoalButtonTitle)} />,
    },
    regular: {
      daysPerWeek: 3,
      title: messages.regularGoalButtonTitle,
      text: messages.regularGoalButtonText,
      icon: <img src={FlagRegularIcon} alt={intl.formatMessage(messages.regularGoalButtonTitle)} />,
    },
    intense: {
      daysPerWeek: 5,
      title: messages.intenseGoalButtonTitle,
      text: messages.intenseGoalButtonText,
      icon: <img src={FlagIntenseIcon} alt={intl.formatMessage(messages.intenseGoalButtonTitle)} />,
    },
  };

  const values = buttonDetails[level];

  return (
    <FlagButton
      buttonIcon={values.icon}
      title={intl.formatMessage(values.title)}
      text={intl.formatMessage(values.text)}
      handleSelect={() => handleSelect(values.daysPerWeek)}
      isSelected={isSelected}
    />
  );
};

LearningGoalButton.propTypes = {
  level: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default LearningGoalButton;
