import { getSiteConfig } from '@openedx/frontend-base';
import { getAllByRole } from '@testing-library/dom';
import { act } from '@testing-library/react';
import {
  fireEvent, initializeTestStore,
  render,
} from '../../setupTest';
import { MasqueradeWidgetOption } from './MasqueradeWidgetOption';

const originalConfig = jest.requireActual('@openedx/frontend-base').getSiteConfig();
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getSiteConfig: jest.fn(),
}));
getSiteConfig.mockImplementation(() => originalConfig);

describe('Masquerade Widget Dropdown', () => {
  let courseware;
  let mockDataStaff;
  let mockDataStudent;
  let active;

  beforeAll(async () => {
    const store = await initializeTestStore();
    courseware = store.getState().courseware;
    active = {
      courseKey: courseware.courseId,
      groupId: null,
      role: 'staff',
      userName: null,
      userPartitionId: null,
      groupName: null,
    };
    mockDataStaff = {
      groupId: null,
      groupName: 'Staff',
      key: 'Staff',
      role: 'staff',
      selected: active,
      userName: null,
      userPartitionId: null,
      userNameInputToggle: () => {},
      onSubmit: () => {},
    };
    mockDataStudent = {
      groupId: null,
      groupName: 'Specific Student...',
      key: 'Specific Student...',
      role: 'student',
      selected: active,
      userName: '',
      userPartitionId: null,
      userNameInputToggle: () => {},
      onSubmit: () => {},
    };
    Object.defineProperty(global, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  it('renders masquerade active option correctly', async () => {
    const { container } = render(<MasqueradeWidgetOption {...mockDataStaff} />);
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    expect(button).toHaveTextContent('Staff');
    expect(button).toHaveClass('active');
  });

  it('renders masquerade inactive option correctly', async () => {
    const { container } = render(<MasqueradeWidgetOption {...mockDataStudent} />);
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    expect(button).toHaveTextContent('Specific Student...');
    expect(button).not.toHaveClass('active');
  });

  it('handles the clicks regular option', () => {
    const onSubmit = jest.fn().mockImplementation(() => Promise.resolve());
    const { container } = render(<MasqueradeWidgetOption {...mockDataStaff} onSubmit={onSubmit} />);
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    act(() => {
      fireEvent.click(button);
    });
    expect(onSubmit).toHaveBeenCalled();
  });

  it('handles the clicks student option', () => {
    const userNameInputToggle = jest.fn().mockImplementation(() => Promise.resolve());
    const { container } = render(
      <MasqueradeWidgetOption {...mockDataStudent} userNameInputToggle={userNameInputToggle} />,
    );
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    act(() => {
      fireEvent.click(button);
    });
    expect(userNameInputToggle).toHaveBeenCalled();
  });
});
