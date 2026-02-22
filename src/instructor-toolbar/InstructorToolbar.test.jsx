import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';
import MockAdapter from 'axios-mock-adapter';
import {
  getByText,
  initializeTestStore,
  logUnhandledRequests,
  render, screen, waitFor,
} from '../setupTest';
import InstructorToolbar from './index';

const originalConfig = jest.requireActual('@openedx/frontend-base').getSiteConfig();
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getSiteConfig: jest.fn(),
}));
getSiteConfig.mockImplementation(() => originalConfig);

describe('Instructor Toolbar', () => {
  let courseware;
  let models;
  let mockData;
  let axiosMock;
  let masqueradeUrl;

  beforeAll(async () => {
    const store = await initializeTestStore();
    courseware = store.getState().courseware;
    models = store.getState().models;

    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    masqueradeUrl = `${getSiteConfig().LMS_BASE_URL}/courses/${courseware.courseId}/masquerade`;
  });

  beforeEach(() => {
    mockData = {
      courseId: courseware.courseId,
      unitId: Object.values(models.units)[0].id,
    };
    axiosMock.reset();
    axiosMock.onGet(masqueradeUrl).reply(200, { success: true });
    logUnhandledRequests(axiosMock);
  });

  it('sends query to masquerade and does not display alerts by default', async () => {
    render(<InstructorToolbar {...mockData} />);

    await waitFor(() => expect(axiosMock.history.get).toHaveLength(1));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('displays masquerade error', async () => {
    axiosMock.reset();
    axiosMock.onGet(masqueradeUrl).reply(200, { success: false });
    render(<InstructorToolbar {...mockData} />);

    await waitFor(() => expect(axiosMock.history.get).toHaveLength(1));
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to get masquerade options');
  });

  it('displays links to view course in available services', () => {
    const config = { ...originalConfig };
    config.INSIGHTS_BASE_URL = 'http://localhost:18100';
    getSiteConfig.mockImplementation(() => config);
    render(<InstructorToolbar {...mockData} />);

    const linksContainer = screen.getByText('View course in:').parentElement;
    ['Studio', 'Insights'].forEach(service => {
      expect(getByText(linksContainer, service).getAttribute('href')).toMatch(/http.*/);
    });
  });

  it('does not display links if there are no services available', () => {
    const config = { ...originalConfig };
    config.STUDIO_BASE_URL = undefined;
    getSiteConfig.mockImplementation(() => config);
    render(<InstructorToolbar {...mockData} unitId={null} />);

    expect(screen.queryByText('View course in:')).not.toBeInTheDocument();
  });
});
