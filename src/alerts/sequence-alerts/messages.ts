import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  entranceExamTextNotPassing: {
    id: 'learn.sequence.entranceExamTextNotPassing',
    defaultMessage: 'To access course materials, you must score {entranceExamMinimumScorePct}% or higher on this exam. Your current score is {entranceExamCurrentScore}%.',
  },
  entranceExamTextPassed: {
    id: 'learn.sequence.entranceExamTextPassed',
    defaultMessage: 'Your score is {entranceExamCurrentScore}%. You have passed the entrance exam.',
  },
});

export default messages;
