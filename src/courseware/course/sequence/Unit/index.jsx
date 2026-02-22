import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { SiteContext, useIntl } from '@openedx/frontend-base';

import { useModel } from '@src/generic/model-store';
import { usePluginsCallback } from '@src/generic/plugin-store';

import UnitTitleSlot from '../../../../slots/UnitTitleSlot';
import messages from '../messages';
import ContentIFrame from './ContentIFrame';
import UnitSuspense from './UnitSuspense';
import { modelKeys, views } from './constants';
import { useExamAccess, useShouldDisplayHonorCode } from './hooks';
import { getIFrameUrl } from './urls';

const Unit = ({
  courseId,
  format = null,
  onLoaded = undefined,
  id,
  isOriginalUserStaff,
  renderUnitNavigation,
}) => {
  const { formatMessage } = useIntl();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { authenticatedUser } = React.useContext(SiteContext);
  const examAccess = useExamAccess({ id });
  const shouldDisplayHonorCode = useShouldDisplayHonorCode({ courseId, id });
  const unit = useModel(modelKeys.units, id);
  const view = authenticatedUser ? views.student : views.public;
  const shouldDisplayUnitPreview = pathname.startsWith('/preview') && isOriginalUserStaff;

  const iframeParams = useMemo(() => ({
    id,
    view,
    format,
    examAccess,
    jumpToId: searchParams.get('jumpToId'),
    preview: shouldDisplayUnitPreview ? '1' : '0',
  }), [id, view, format, examAccess, searchParams, shouldDisplayUnitPreview]);

  const getUrl = usePluginsCallback('getIFrameUrl', () => getIFrameUrl(iframeParams));

  const iframeUrl = useMemo(() => getUrl(), [getUrl]);

  return (
    <div className="unit">
      <UnitTitleSlot unitId={id} unit={unit} renderUnitNavigation={renderUnitNavigation} />
      <UnitSuspense courseId={courseId} id={id} />
      <ContentIFrame
        elementId="unit-iframe"
        id={id}
        iframeUrl={iframeUrl}
        loadingMessage={formatMessage(messages.loadingSequence)}
        onLoaded={onLoaded}
        shouldShowContent={!shouldDisplayHonorCode && !examAccess.blockAccess}
        title={unit.title}
        courseId={courseId}
      />
    </div>
  );
};

Unit.propTypes = {
  courseId: PropTypes.string.isRequired,
  format: PropTypes.string,
  id: PropTypes.string.isRequired,
  onLoaded: PropTypes.func,
  isOriginalUserStaff: PropTypes.bool.isRequired,
  renderUnitNavigation: PropTypes.func.isRequired,
};



export default Unit;
