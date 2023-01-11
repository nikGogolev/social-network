import { render } from '@testing-library/react';

import MyPopup from './my-popup';

describe('MyPopup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyPopup />);
    expect(baseElement).toBeTruthy();
  });
});
