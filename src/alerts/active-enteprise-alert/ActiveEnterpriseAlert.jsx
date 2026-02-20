import { FormattedMessage, useIntl } from '@openedx/frontend-base';
import { Alert, Hyperlink } from '@openedx/paragon';
import { WarningFilled } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import { getSiteConfig } from '@openedx/frontend-base';
import genericMessages from './messages';

const ActiveEnterpriseAlert = ({ payload }) => {
  const intl = useIntl();
  const { text, courseId } = payload;
  const changeActiveEnterprise = (
    <Hyperlink
      style={{ textDecoration: 'underline' }}
      destination={
        `${getSiteConfig().lmsBaseUrl}/enterprise/select/active/?success_url=${encodeURIComponent(
          `${global.location.origin}/course/${courseId}/home`,
        )}`
    }
    >
      {intl.formatMessage(genericMessages.changeActiveEnterpriseLowercase)}
    </Hyperlink>
  );

  return (
    <Alert variant="warning" icon={WarningFilled}>
      {text}
      <FormattedMessage
        id="learning.activeEnterprise.alert"
        description="Prompts the user to log-in with the correct enterprise to access the course content."
        defaultMessage=" {changeActiveEnterprise}."
        values={{
          changeActiveEnterprise,
        }}
      />
    </Alert>
  );
};

ActiveEnterpriseAlert.propTypes = {
  payload: PropTypes.shape({
    text: PropTypes.string,
    courseId: PropTypes.string,
  }).isRequired,
};

export default ActiveEnterpriseAlert;
