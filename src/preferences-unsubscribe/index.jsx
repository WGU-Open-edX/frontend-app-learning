import { useEffect, useState } from 'react';

import { Container, Hyperlink, Icon } from '@openedx/paragon';
import { CheckCircleLightOutline, ErrorOutline } from '@openedx/paragon/icons';
import { useParams } from 'react-router-dom';

import { FormattedMessage, getSiteConfig, logError, sendTrackEvent, useIntl } from '@openedx/frontend-base';

import { FAILED, LOADED, LOADING } from '@src/constants';
import PageLoading from '../generic/PageLoading';
import { unsubscribeNotificationPreferences } from './data/api';
import messages from './messages';

const PreferencesUnsubscribe = () => {
  const intl = useIntl();
  const { userToken } = useParams();
  const [status, setStatus] = useState(LOADING);

  useEffect(() => {
    unsubscribeNotificationPreferences(userToken).then(
      () => setStatus(LOADED),
      (error) => {
        setStatus(FAILED);
        logError(error);
      },
    );
    sendTrackEvent('edx.ui.lms.notifications.preferences.unsubscribe', { userToken });
  }, []);

  const pageContent = {
    icon: CheckCircleLightOutline,
    iconClass: 'text-success',
    headingText: messages.unsubscribeSuccessHeading,
    bodyText: messages.unsubscribeSuccessMessage,
  };

  if (status === FAILED) {
    pageContent.icon = ErrorOutline;
    pageContent.iconClass = 'text-danger';
    pageContent.headingText = messages.unsubscribeFailedHeading;
    pageContent.bodyText = messages.unsubscribeFailedMessage;
  }

  return (
    <div style={{ height: '100vh' }}>
      <Container size="xs" className="h-75 mx-auto my-auto">
        <div className="d-flex flex-row h-100">
          <div className="mx-auto my-auto">
            {status === LOADING && <PageLoading srMessage={`${intl.formatMessage(messages.unsubscribeLoading)}`} />}
            {status !== LOADING && (
              <>
                <Icon src={pageContent.icon} className={`size-56px mx-auto ${pageContent.iconClass}`} />
                <h3 className="font-weight-bold text-primary-500 text-center my-3" data-testid="heading-text">
                  {intl.formatMessage(pageContent.headingText)}
                </h3>
                <div className="font-weight-normal text-gray-700 text-center">
                  {intl.formatMessage(pageContent.bodyText)}
                </div>
                <small className="d-block font-weight-normal text-gray text-center mt-3">
                  <FormattedMessage
                    id="learning.notification.preferences.unsubscribe.preferenceCenterUrl"
                    description="Shown as a suggestion or recommendation for learner when their unsubscribing request has failed"
                    defaultMessage="Go to the {preferenceCenterUrl} to set your preferences"
                    values={{
                      preferenceCenterUrl: (
                        <Hyperlink
                          destination={`${getSiteConfig().ACCOUNT_SETTINGS_URL}/#notifications`}
                        >
                          {intl.formatMessage(messages.preferenceCenterUrl)}
                        </Hyperlink>
                      ),
                    }}
                  />
                </small>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PreferencesUnsubscribe;
