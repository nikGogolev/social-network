import { render } from '@testing-library/react';

import Logout from '.';

describe('Logout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Logout />);
    expect(baseElement).toBeTruthy();
  });
});
