import { getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Button, Hyperlink } from '@openedx/paragon';
import PropTypes from 'prop-types';

import messages from './messages';
import UnsubscribeIcon from './unsubscribe.svg';

const ResultPage = ({ courseTitle = null, error = false }) => {
  const intl = useIntl();
  const errorDescription = intl.formatMessage(
    messages.errorDescription,
    {
      contactSupport: (
        <Hyperlink
          className="text-reset"
          style={{ textDecoration: 'underline' }}
          destination={`${getSiteConfig().CONTACT_URL}`}
        >
          {intl.formatMessage(messages.contactSupport)}
        </Hyperlink>
      ),
    },
  );

  const header = error
    ? intl.formatMessage(messages.errorHeader)
    : intl.formatMessage(messages.header);
  const description = error
    ? errorDescription
    : intl.formatMessage(messages.description, { courseTitle });

  return (
    <>
      {/* TODO: test this, probably we'll need something different to amke sure text-primary works */}
      <img src={UnsubscribeIcon} className='text-primary' alt="Unsubscribe icon" />
      <div role="heading" aria-level="1" className="h2">{header}</div>
      <div className="row justify-content-center">
        <div className="col-xl-7 col-12 p-0">{description}</div>
      </div>
      <Button variant="brand" href={`${getSiteConfig().lmsBaseUrl}/dashboard`} className="mt-4">
        {intl.formatMessage(messages.goToDashboard)}
      </Button>
    </>
  );
};

ResultPage.propTypes = {
  courseTitle: PropTypes.string,
  error: PropTypes.bool,
};

export default ResultPage;
