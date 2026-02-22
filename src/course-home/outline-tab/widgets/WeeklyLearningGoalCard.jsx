import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getAuthenticatedUser, sendTrackEvent, useIntl } from '@openedx/frontend-base';
import { Card, Form, Icon } from '@openedx/paragon';
import { Email } from '@openedx/paragon/icons';
import { useSelector } from 'react-redux';
import { useModel } from '../../../generic/model-store';
import { saveWeeklyLearningGoal } from '../../data';
import messages from '../messages';
import './FlagButton.scss';
import LearningGoalButton from './LearningGoalButton';

const WeeklyLearningGoalCard = ({
  daysPerWeek = null,
  subscribedToReminders = false,
}) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    isMasquerading,
    org,
  } = useModel('courseHomeMeta', courseId);

  const { administrator } = getAuthenticatedUser();

  const [daysPerWeekGoal, setDaysPerWeekGoal] = useState(daysPerWeek);
  // eslint-disable-next-line react/prop-types
  const [isGetReminderSelected, setGetReminderSelected] = useState(subscribedToReminders);
  const location = useLocation();

  const handleSelect = (days, triggeredFromEmail = false) => {
    // Set the subscription button if this is the first time selecting a goal
    const selectReminders = daysPerWeekGoal === null ? true : isGetReminderSelected;
    setGetReminderSelected(selectReminders);
    setDaysPerWeekGoal(days);
    if (!isMasquerading) { // don't save goal updates while masquerading
      saveWeeklyLearningGoal(courseId, days, selectReminders);
      sendTrackEvent('edx.ui.lms.goal.days-per-week.changed', {
        org_key: org,
        courserun_key: courseId,
        is_staff: administrator,
        num_days: days,
        reminder_selected: selectReminders,
      });
      if (triggeredFromEmail) {
        sendTrackEvent('enrollment.email.clicked.setgoal', {});
      }
    }
  };

  function handleSubscribeToReminders(event) {
    const isGetReminderChecked = event.target.checked;
    setGetReminderSelected(isGetReminderChecked);
    if (!isMasquerading) { // don't save goal updates while masquerading
      saveWeeklyLearningGoal(courseId, daysPerWeekGoal, isGetReminderChecked);
      sendTrackEvent('edx.ui.lms.goal.reminder-selected.changed', {
        org_key: org,
        courserun_key: courseId,
        is_staff: administrator,
        num_days: daysPerWeekGoal,
        reminder_selected: isGetReminderChecked,
      });
    }
  }

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const weeklyGoal = Number(currentParams.get('weekly_goal'));
    if ([1, 3, 5].includes(weeklyGoal)) {
      handleSelect(weeklyGoal, true);

      // Deleting the weekly_goal query param as it only needs to be set once
      // whenever passed in query params.
      currentParams.delete('weekly_goal');
      navigate(`?${currentParams.toString()}`, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <Card
      id="courseHome-weeklyLearningGoal"
      className="row w-100 m-0 mb-3 raised-card"
      data-testid="weekly-learning-goal-card"
    >
      <Card.Header
        size="sm"
        title={(<div id="set-weekly-goal-header">{intl.formatMessage(messages.setWeeklyGoal)}</div>)}
        subtitle={intl.formatMessage(messages.setWeeklyGoalDetail)}
      />
      <Card.Section className="text-gray-700 small">
        <div
          role="radiogroup"
          aria-labelledby="set-weekly-goal-header"
          className="flag-button-container m-0 p-0"
        >
          <LearningGoalButton
            level="casual"
            isSelected={daysPerWeekGoal === 1}
            handleSelect={handleSelect}
          />
          <LearningGoalButton
            level="regular"
            isSelected={daysPerWeekGoal === 3}
            handleSelect={handleSelect}
          />
          <LearningGoalButton
            level="intense"
            isSelected={daysPerWeekGoal === 5}
            handleSelect={handleSelect}
          />
        </div>
        <div className="d-flex pt-3">
          <Form.Switch
            checked={isGetReminderSelected}
            onChange={(event) => handleSubscribeToReminders(event)}
            disabled={!daysPerWeekGoal}
          >
            <small>{intl.formatMessage(messages.setGoalReminder)}</small>
          </Form.Switch>
        </div>
      </Card.Section>
      {isGetReminderSelected && (
        <Card.Section muted>
          <div className="row w-100 m-0 small align-center">
            <div className="d-flex align-items-center pr-1">
              <Icon
                className="text-primary-500"
                src={Email}
              />
            </div>
            <div className="col">
              {intl.formatMessage(messages.goalReminderDetail)}
            </div>
          </div>
        </Card.Section>
      )}
    </Card>
  );
};

WeeklyLearningGoalCard.propTypes = {
  daysPerWeek: PropTypes.number,
  subscribedToReminders: PropTypes.bool,
};


export default WeeklyLearningGoalCard;
