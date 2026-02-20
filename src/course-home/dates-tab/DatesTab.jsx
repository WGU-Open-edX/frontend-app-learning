import { sendTrackEvent, useIntl } from '@openedx/frontend-base';
import { useSelector } from 'react-redux';

import messages from './messages';
import Timeline from './timeline/Timeline';

import { useModel } from '../../generic/model-store';
import { fetchDatesTab } from '../data';

import ShiftDatesAlert from '../suggested-schedule-messaging/ShiftDatesAlert';
import SuggestedScheduleHeader from '../suggested-schedule-messaging/SuggestedScheduleHeader';
import UpgradeToCompleteAlert from '../suggested-schedule-messaging/UpgradeToCompleteAlert';
import UpgradeToShiftDatesAlert from '../suggested-schedule-messaging/UpgradeToShiftDatesAlert';

const DatesTab = () => {
  const intl = useIntl();
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    isSelfPaced,
    org,
  } = useModel('courseHomeMeta', courseId);

  const {
    courseDateBlocks,
  } = useModel('dates', courseId);

  const hasDeadlines = courseDateBlocks && courseDateBlocks.some(x => x.dateType === 'assignment-due-date');

  const logUpgradeLinkClick = () => {
    sendTrackEvent('edx.bi.ecommerce.upsell_links_clicked', {
      org_key: org,
      courserun_key: courseId,
      linkCategory: 'personalized_learner_schedules',
      linkName: 'dates_upgrade',
      linkType: 'button',
      pageName: 'dates_tab',
    });
  };

  return (
    <>
      <div role="heading" aria-level="1" className="h2 my-3">
        {intl.formatMessage(messages.title)}
      </div>
      {isSelfPaced && hasDeadlines && (
        <>
          <ShiftDatesAlert model="dates" fetch={fetchDatesTab} />
          <SuggestedScheduleHeader />
          <UpgradeToCompleteAlert logUpgradeLinkClick={logUpgradeLinkClick} />
          <UpgradeToShiftDatesAlert logUpgradeLinkClick={logUpgradeLinkClick} model="dates" />
        </>
      )}
      <Timeline />
    </>
  );
};

export default DatesTab;
