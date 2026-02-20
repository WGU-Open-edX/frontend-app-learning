import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import { render, screen } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';

import { UserMessagesProvider } from '../../generic/user-messages';
import { act, initializeMockApp } from '../../setupTest';
import initializeStore from '../../store';
import GoalUnsubscribe from './GoalUnsubscribe';

initializeMockApp();
jest.mock('@openedx/frontend-base');

describe('GoalUnsubscribe', () => {
  let axiosMock;
  let store;
  let component;
  const unsubscribeUrl = `${getSiteConfig().LMS_BASE_URL}/api/course_home/unsubscribe_from_course_goal/TOKEN`;

  beforeEach(() => {
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    store = initializeStore();
    component = (
      <SiteProvider store={store} wrapWithRouter={false}>
        <UserMessagesProvider>
          <MemoryRouter initialEntries={['/goal-unsubscribe/TOKEN']}>
            <Routes>
              <Route path="/goal-unsubscribe/:token" element={<GoalUnsubscribe />} />
            </Routes>
          </MemoryRouter>
        </UserMessagesProvider>
      </SiteProvider>
    );
  });

  it('starts with a spinner', () => {
    render(component);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads a real token', async () => {
    const response = { course_title: 'My Sample Course' };
    axiosMock.onPost(unsubscribeUrl).reply(200, response);
    await act(async () => render(component));

    expect(screen.getByText('You’ve unsubscribed from goal reminders')).toBeInTheDocument();
    expect(screen.getByText(/your goal for My Sample Course/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to dashboard' }))
      .toHaveAttribute('href', 'http://localhost:18000/dashboard');
  });

  it('loads a bad token with an error page', async () => {
    axiosMock.onPost(unsubscribeUrl).reply(404, {});
    await act(async () => render(component));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to dashboard' }))
      .toHaveAttribute('href', 'http://localhost:18000/dashboard');
    expect(screen.getByRole('link', { name: 'contact support' }))
      .toHaveAttribute('href', 'http://localhost:18000/contact');
  });
});
