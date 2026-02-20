
import { getSiteConfig } from '@openedx/frontend-base';
import {
  act,
  initializeMockApp,
  render,
} from '../../setupTest';
import NoticesProvider from './NoticesProvider';
import { getNotices } from './api';

jest.mock('./api', () => ({
  getNotices: jest.fn(),
}));

jest.mock('@openedx/frontend-base', () => ({
  getSiteConfig: jest.fn(),
}));

describe('NoticesProvider', () => {
  beforeAll(async () => {
    jest.resetModules();
    await initializeMockApp();
  });

  function buildAndRender() {
    render(
      <NoticesProvider>
        <div />
      </NoticesProvider>,
    );
  }

  it('does not call api if ENABLE_NOTICES is false', () => {
    getSiteConfig.mockImplementation(() => ({ ENABLE_NOTICES: false }));
    buildAndRender();
    expect(getNotices).toHaveBeenCalledTimes(0);
  });

  it('redirects user on notice returned from API', async () => {
    const redirectUrl = 'http://example.com/test_route';
    getSiteConfig.mockImplementation(() => ({ ENABLE_NOTICES: true }));
    getNotices.mockImplementation(() => ({ results: [redirectUrl] }));
    delete window.location;
    window.location = { replace: jest.fn() };
    process.env.ENABLE_NOTICES = true;
    await act(async () => buildAndRender());
    expect(window.location.replace).toHaveBeenCalledWith(`${redirectUrl}?next=${window.location.href}`);
  });

  it('does not redirect on no data', async () => {
    getNotices.mockImplementation(() => ({}));
    getSiteConfig.mockImplementation(() => ({ ENABLE_NOTICES: true }));
    delete window.location;
    window.location = { replace: jest.fn() };
    process.env.ENABLE_NOTICES = true;
    await act(async () => buildAndRender());
    expect(window.location.replace).toHaveBeenCalledTimes(0);
    expect(window.location.toString() === 'http://localhost/');
  });
});
