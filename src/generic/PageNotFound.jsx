import { getSiteConfig, logError, sendTrackEvent, useIntl } from '@openedx/frontend-base';
import { Hyperlink } from '@openedx/paragon';

import messages from './messages';

const PageNotFound = () => {
  const { formatMessage } = useIntl();
  const location = window.location.href;

  logError('Page failed to load, probably an invalid URL.', location);
  sendTrackEvent('edx.ui.lms.page_not_found', { location });

  return (
    <>
      <main
        id="main-content"
        className="main-content d-flex justify-content-center align-items-center flex-column"
        style={{
          height: '50vh',
        }}
      >
        <h1 className="h3">
          {formatMessage(messages.pageNotFoundHeader)}
        </h1>
        <p>
          {formatMessage(
            messages.pageNotFoundBody,
            {
              homepageLink: (
                <Hyperlink destination={getSiteConfig().lmsBaseUrl}>
                  {formatMessage(messages.homepageLink)}
                </Hyperlink>
              ),
            },
          )}
        </p>
      </main>
    </>
  );
};

export default PageNotFound;
