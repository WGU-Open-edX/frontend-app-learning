/* eslint-disable @typescript-eslint/no-use-before-define */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// TODO: Re-enable when library is compatible with frontend-base
// import SequenceExamWrapper from '@edx/frontend-lib-special-exams';
import {
  sendTrackEvent,
  sendTrackingLogEvent,
  useIntl,
} from '@openedx/frontend-base';
import { useSelector } from 'react-redux';

import { useSequenceBannerTextAlert, useSequenceEntranceExamAlert } from '@src/alerts/sequence-alerts/hooks';
import { useModel } from '@src/generic/model-store';
import PageLoading from '@src/generic/PageLoading';
import { CourseOutlineSidebarSlot } from '@src/slots/CourseOutlineSidebarSlot';
import { CourseOutlineSidebarTriggerSlot } from '@src/slots/CourseOutlineSidebarTriggerSlot';
import { NotificationsDiscussionsSidebarSlot } from '@src/slots/NotificationsDiscussionsSidebarSlot';
import SequenceContainerSlot from '@src/slots/SequenceContainerSlot';
import SequenceNavigationSlot from '@src/slots/SequenceNavigationSlot';

import CourseLicense from '../course-license';
import HiddenAfterDue from './hidden-after-due';
import messages from './messages';
import { UnitNavigation } from './sequence-navigation';
import SequenceContent from './SequenceContent';

const Sequence = ({
  unitId = null,
  sequenceId = null,
  courseId,
  unitNavigationHandler,
  nextSequenceHandler,
  previousSequenceHandler,
  onUnitChange,
}) => {
  // Use local state for unit navigation to prevent URL changes and re-renders
  const [currentUnitId, setCurrentUnitId] = useState(unitId);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update local state when URL unitId changes (for external navigation)
  useEffect(() => {
    if (unitId) {
      setCurrentUnitId(unitId);
      // Notify parent component of unit change
      if (onUnitChange) {
        onUnitChange(unitId);
      }
    }
  }, [unitId, onUnitChange]);
  
  const intl = useIntl();
  const {
    canAccessProctoredExams,
    license,
  } = useModel('coursewareMeta', courseId);
  const {
    isStaff,
    originalUserIsStaff,
  } = useModel('courseHomeMeta', courseId);
  const sequence = useModel('sequences', sequenceId);
  const section = useModel('sections', sequence ? sequence.sectionId : null);
  const unit = useModel('units', currentUnitId);
  const sequenceStatus = useSelector(state => state.courseware.sequenceStatus);
  const sequenceMightBeUnit = useSelector(state => state.courseware.sequenceMightBeUnit);

  const handleNext = () => {
    const nextIndex = sequence.unitIds.indexOf(currentUnitId) + 1;
    
    if (nextIndex < sequence.unitIds.length) {
      // Navigate within same sequence using state + URL update (no re-render)
      const newUnitId = sequence.unitIds[nextIndex];
      setCurrentUnitId(newUnitId);
      
      // Notify parent component of unit change
      if (onUnitChange) {
        onUnitChange(newUnitId);
      }
      
      // Update URL without triggering React Router re-render
      const isPreview = location.pathname.startsWith('/preview');
      const basePath = isPreview ? `/preview/learning/course/${courseId}/${sequenceId}` : `/learning/course/${courseId}/${sequenceId}`;
      const newUrl = `${basePath}/${newUnitId}`;
      window.history.replaceState(null, '', newUrl);
    } else {
      // Navigate to next sequence (requires full URL change)
      nextSequenceHandler();
    }
  };

  const handlePrevious = () => {
    const previousIndex = sequence.unitIds.indexOf(currentUnitId) - 1;
    
    if (previousIndex >= 0) {
      // Navigate within same sequence using state + URL update (no re-render)
      const newUnitId = sequence.unitIds[previousIndex];
      setCurrentUnitId(newUnitId);
      
      // Notify parent component of unit change
      if (onUnitChange) {
        onUnitChange(newUnitId);
      }
      
      // Update URL without triggering React Router re-render
      const isPreview = location.pathname.startsWith('/preview');
      const basePath = isPreview ? `/preview/learning/course/${courseId}/${sequenceId}` : `/learning/course/${courseId}/${sequenceId}`;
      const newUrl = `${basePath}/${newUnitId}`;
      window.history.replaceState(null, '', newUrl);
    } else {
      // Navigate to previous sequence (requires full URL change)
      previousSequenceHandler();
    }
  };

  const handleNavigate = (destinationUnitId) => {
    // For unit navigation within sequence, use state + URL update (no re-render)
    if (sequence.unitIds.includes(destinationUnitId)) {
      setCurrentUnitId(destinationUnitId);
      
      // Notify parent component of unit change
      if (onUnitChange) {
        onUnitChange(destinationUnitId);
      }
      
      // Update URL without triggering React Router re-render
      const isPreview = location.pathname.startsWith('/preview');
      const basePath = isPreview ? `/preview/learning/course/${courseId}/${sequenceId}` : `/learning/course/${courseId}/${sequenceId}`;
      const newUrl = `${basePath}/${destinationUnitId}`;
      window.history.replaceState(null, '', newUrl);
    } else {
      // For navigation outside sequence, use URL navigation
      unitNavigationHandler(destinationUnitId);
    }
  };

  const logEvent = (eventName, widgetPlacement, targetUnitId) => {
    // Note: tabs are tracked with a 1-indexed position
    // as opposed to a 0-index used throughout this MFE
    const currentIndex = sequence.unitIds.length > 0 ? sequence.unitIds.indexOf(currentUnitId) : 0;
    const payload = {
      current_tab: currentIndex + 1,
      id: currentUnitId,
      tab_count: sequence.unitIds.length,
      widget_placement: widgetPlacement,
    };
    if (targetUnitId) {
      const targetIndex = sequence.unitIds.indexOf(targetUnitId);
      payload.target_tab = targetIndex + 1;
    }
    sendTrackEvent(eventName, payload);
    sendTrackingLogEvent(eventName, payload);
  };

  /* istanbul ignore next */
  const nextHandler = () => {
    logEvent('edx.ui.lms.sequence.next_selected', 'top');
    handleNext();
  };

  /* istanbul ignore next */
  const previousHandler = () => {
    logEvent('edx.ui.lms.sequence.previous_selected', 'top');
    handlePrevious();
  };

  /* istanbul ignore next */
  const onNavigate = (destinationUnitId) => {
    logEvent('edx.ui.lms.sequence.tab_selected', 'top', destinationUnitId);
    handleNavigate(destinationUnitId);
  };

  const sequenceNavProps = {
    nextHandler,
    previousHandler,
    onNavigate,
  };

  useSequenceBannerTextAlert(sequenceId);
  useSequenceEntranceExamAlert(courseId, sequenceId, intl);

  useEffect(() => {
    function receiveMessage(event) {
      const { type } = event.data;
      if (type === 'entranceExam.passed') {
        // I know this seems (is) intense. It is implemented this way since we need to refetch the underlying
        // course blocks that were originally hidden because the Entrance Exam was not passed.
        global.location.reload();
      }
    }
    global.addEventListener('message', receiveMessage);
  }, []);

  const [unitHasLoaded, setUnitHasLoaded] = useState(false);
  const handleUnitLoaded = () => {
    setUnitHasLoaded(true);
  };

  // We want hide the unit navigation if we're in the middle of navigating to another unit
  // but not if other things about the unit change, like the bookmark status.
  // The array property of this useEffect ensures that we only hide the unit navigation
  // while navigating to another unit.
  useEffect(() => {
    if (unit) {
      setUnitHasLoaded(false);
    }
  }, [(unit || {}).id]);

  // If sequence might be a unit, we want to keep showing a spinner - the courseware container will redirect us when
  // it knows which sequence to actually go to.
  const loading = sequenceStatus === 'loading' || (sequenceStatus === 'failed' && sequenceMightBeUnit);
  if (loading) {
    if (!sequenceId) {
      return (<div> {intl.formatMessage(messages.noContent)} </div>);
    }
    return (
      <PageLoading
        srMessage={intl.formatMessage(messages.loadingSequence)}
      />
    );
  }

  if (sequenceStatus === 'loaded' && sequence.isHiddenAfterDue) {
    // Shouldn't even be here - these sequences are normally stripped out of the navigation.
    // But we are here, so render a notice instead of the normal content.
    return <HiddenAfterDue courseId={courseId} />;
  }

  const gated = sequence && sequence.gatedContent !== undefined && sequence.gatedContent.gated;

  const renderUnitNavigation = (isAtTop) => (
    <UnitNavigation
      courseId={courseId}
      sequenceId={sequenceId}
      unitId={currentUnitId}
      isAtTop={isAtTop}
      onClickPrevious={() => {
        logEvent('edx.ui.lms.sequence.previous_selected', 'bottom');
        handlePrevious();
      }}
      onClickNext={() => {
        logEvent('edx.ui.lms.sequence.next_selected', 'bottom');
        handleNext();
      }}
    />
  );

  const defaultContent = (
    <>
      <div className="sequence-container d-inline-flex flex-row w-100">
        <CourseOutlineSidebarTriggerSlot
          sectionId={section ? section.id : null}
          sequenceId={sequenceId}
          isStaff={isStaff}
          unitId={unitId}
        />
        <CourseOutlineSidebarSlot />
        <div className="sequence w-100">
          <div className="sequence-navigation-container">
            {/**
             SequenceNavigationSlot renders nothing by default.
             However, we still pass nextHandler, previousHandler, and onNavigate,
             because, as per the slot's contract, if this slot is replaced
             with the default SequenceNavigation component, these props are required.
             These handlers are excluded from test coverage via istanbul ignore,
             since they are not used unless the slot is overridden.
             */}
            <SequenceNavigationSlot
              sequenceId={sequenceId}
              unitId={currentUnitId}
              {...{
                ...sequenceNavProps,
                nextSequenceHandler,
                handleNavigate,
              }}
            />
          </div>

          <div className="unit-container flex-grow-1 pt-4">
            <SequenceContent
              courseId={courseId}
              gated={gated}
              sequenceId={sequenceId}
              unitId={currentUnitId}
              unitLoadedHandler={handleUnitLoaded}
              isOriginalUserStaff={originalUserIsStaff}
              renderUnitNavigation={renderUnitNavigation}
            />
            {unitHasLoaded && renderUnitNavigation(false)}
          </div>
        </div>
        <NotificationsDiscussionsSidebarSlot courseId={courseId} />
      </div>
      <SequenceContainerSlot courseId={courseId} unitId={currentUnitId} />
    </>
  );

  if (sequenceStatus === 'loaded') {
    return (
      <>
        <div className="d-flex flex-column flex-grow-1 justify-content-center">
          {/* TODO: Re-enable when library is compatible with frontend-base */}
          {/*
          <SequenceExamWrapper
            sequence={sequence}
            courseId={courseId}
            isStaff={isStaff}
            originalUserIsStaff={originalUserIsStaff}
            canAccessProctoredExams={canAccessProctoredExams}
          >
            {defaultContent}
          </SequenceExamWrapper>
          */}
          {defaultContent}
        </div>
        <CourseLicense license={license || undefined} />
      </>
    );
  }

  // sequence status 'failed' and any other unexpected sequence status.
  return (
    <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
      {intl.formatMessage(messages.loadFailure)}
    </p>
  );
};

Sequence.propTypes = {
  unitId: PropTypes.string,
  sequenceId: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  unitNavigationHandler: PropTypes.func.isRequired,
  nextSequenceHandler: PropTypes.func.isRequired,
  previousSequenceHandler: PropTypes.func.isRequired,  onUnitChange: PropTypes.func,};



export default Sequence;
