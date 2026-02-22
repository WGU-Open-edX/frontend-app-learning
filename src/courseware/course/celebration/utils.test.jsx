import { recordFirstSectionCelebration } from './utils';

jest.mock('@openedx/frontend-base');
jest.mock('./data/api');
jest.mock('@openedx/frontend-base', () => ({
  getAuthenticatedUser: jest.fn(() => ({ administrator: 'admin' })),
}));

describe('recordFirstSectionCelebration', () => {
  it('updates the local copy of the course data from the LMS', async () => {
    const dispatchMock = jest.fn();
    recordFirstSectionCelebration('org', 'courseId', 'celebration', dispatchMock);
    expect(dispatchMock).toHaveBeenCalled();
  });
});
