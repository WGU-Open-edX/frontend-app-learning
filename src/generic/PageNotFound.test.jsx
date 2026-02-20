import { getSiteConfig, history, sendTrackEvent } from '@openedx/frontend-base';
import { Route, Routes } from 'react-router-dom';

import {
  initializeTestStore,
  render,
  screen,
} from '../setupTest';
import PageNotFound from './PageNotFound';
import messages from './messages';

jest.mock('@openedx/frontend-base');

describe('PageNotFound', () => {
  beforeEach(async () => {
    await initializeTestStore();
    const invalidUrl = '/new/course';
    history.push(invalidUrl);
    render(
      <Routes>
        <Route path="*" element={<PageNotFound />} />
      </Routes>,
      { wrapWithRouter: true },
    );
  });

  it('displays page not found header', () => {
    expect(screen.getByText(messages.pageNotFoundHeader.defaultMessage)).toBeVisible();
  });

  it('displays link back to learner dashboard', () => {
    const expected = getSiteConfig().LMS_BASE_URL;
    const homepageLink = screen.getByRole('link', { name: messages.homepageLink.defaultMessage });
    expect(homepageLink).toHaveAttribute('href', expected);
  });

  it('calls tracking events', () => {
    expect(sendTrackEvent).toHaveBeenCalled();
  });
});
