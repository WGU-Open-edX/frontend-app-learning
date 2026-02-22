import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { getAuthenticatedUser, sendTrackEvent, useIntl } from '@openedx/frontend-base';
import { Button, Icon } from '@openedx/paragon';
import { Compass } from '@openedx/paragon/icons';

import { useModel } from '../../generic/model-store';
import { launchCourseHomeTour } from '../data/slice';
import messages from '../messages';

const LaunchCourseHomeTourButton = ({ srOnly = false }) => {
  const intl = useIntl();
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    org,
  } = useModel('courseHomeMeta', courseId);

  const {
    toursEnabled,
  } = useSelector(state => state.tours);

  const dispatch = useDispatch();

  const handleClick = () => {
    const { administrator } = getAuthenticatedUser();
    sendTrackEvent('edx.ui.lms.launch_tour.clicked', {
      org_key: org,
      courserun_key: courseId,
      is_staff: administrator,
      tour_variant: 'course_home',
    });

    dispatch(launchCourseHomeTour());
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {toursEnabled && (
        <Button variant="link" size="inline" className={`p-0 ${srOnly && 'sr-only sr-only-focusable'}`} onClick={handleClick}>
          {!srOnly && (
            <Icon
              src={Compass}
              className="mr-2"
              style={{ height: '18px', width: '18px' }}
            />
          )}
          {intl.formatMessage(messages.launchTour)}
        </Button>
      )}
    </>
  );
};



LaunchCourseHomeTourButton.propTypes = {
  srOnly: PropTypes.bool,
};

export default LaunchCourseHomeTourButton;
