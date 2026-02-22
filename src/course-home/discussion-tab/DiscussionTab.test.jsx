import { getAuthenticatedHttpClient, getSiteConfig, history } from '@openedx/frontend-base';
import { render } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { Factory } from 'rosie';
import { UserMessagesProvider } from '../../generic/user-messages';
import {
  initializeMockApp, messageEvent, screen, waitFor,
} from '../../setupTest';
import initializeStore from '../../store';
import { TabContainer } from '../../tab-page';
import { appendBrowserTimezoneToUrl } from '../../utils';
import { fetchDiscussionTab } from '../data/thunks';
import DiscussionTab from './DiscussionTab';

initializeMockApp();
jest.mock('@openedx/frontend-base');

describe('DiscussionTab', () => {
  let axiosMock;
  let store;
  let component;

  beforeEach(() => {
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    store = initializeStore();
    component = (
      <SiteProvider store={store}>
        <UserMessagesProvider>
          <Routes>
            <Route
              path="/course/:courseId/discussion"
              element={(
                <TabContainer tab="discussion" fetch={fetchDiscussionTab} slice="courseHome">
                  <DiscussionTab />
                </TabContainer>
              )}
            />
          </Routes>
        </UserMessagesProvider>
      </SiteProvider>
    );
  });

  const courseMetadata = Factory.build('courseHomeMetadata', { user_timezone: 'America/New_York' });
  const { id: courseId } = courseMetadata;

  let courseMetadataUrl = `${getSiteConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseId}`;
  courseMetadataUrl = appendBrowserTimezoneToUrl(courseMetadataUrl);

  beforeEach(() => {
    axiosMock.onGet(courseMetadataUrl).reply(200, courseMetadata);
    history.push(`/course/${courseId}/discussion`); // so tab can pull course id from url

    render(component);
  });

  it('resizes when it gets a size hint from iframe', async () => {
    window.postMessage({ ...messageEvent, payload: { height: 1234 } }, '*');
    await waitFor(() => expect(screen.getByTitle('discussion'))
      .toHaveAttribute('height', String(1234)));
  });
});
