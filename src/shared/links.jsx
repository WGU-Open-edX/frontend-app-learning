import { getAuthenticatedUser, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Hyperlink } from '@openedx/paragon';

import messages from '../courseware/course/course-exit/messages';

const DashboardLink = () => {
  const intl = useIntl();
  return (
    <Hyperlink
      variant="muted"
      isInline
      destination={`${getSiteConfig().lmsBaseUrl}/dashboard`}
    >
      {intl.formatMessage(messages.dashboardLink)}
    </Hyperlink>
  );
};

const IdVerificationSupportLink = () => {
  const intl = useIntl();
  if (!getSiteConfig().SUPPORT_URL_ID_VERIFICATION) {
    return null;
  }
  return (
    <Hyperlink
      variant="muted"
      isInline
      destination={getSiteConfig().SUPPORT_URL_ID_VERIFICATION}
    >
      {intl.formatMessage(messages.idVerificationSupportLink)}
    </Hyperlink>
  );
};

const ProfileLink = () => {
  const intl = useIntl();
  const { username } = getAuthenticatedUser();

  return (
    <Hyperlink
      variant="muted"
      isInline
      destination={`${getSiteConfig().ACCOUNT_PROFILE_URL}/u/${username}`}
    >
      {intl.formatMessage(messages.profileLink)}
    </Hyperlink>
  );
};

export { DashboardLink, IdVerificationSupportLink, ProfileLink };
