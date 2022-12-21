import { render } from '@testing-library/react';

import FriendCard from './friend-card';

describe('FriendCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FriendCard />);
    expect(baseElement).toBeTruthy();
  });
});
