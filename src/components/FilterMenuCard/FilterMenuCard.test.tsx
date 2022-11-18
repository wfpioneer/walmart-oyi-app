import { render } from '@testing-library/react-native';
import React from 'react';
import { MenuCard } from './FilterMenuCard';

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
describe('Filter menu card render tests', () => {
  it('Renders MenuCard with the dropdown icon Open', () => {
    const { toJSON } = render(
      <MenuCard
        title="Menu Card Title"
        subtext="Sub Text Opened"
        opened={true}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders MenuCard with the dropdown icon Closed', () => {
    const { toJSON } = render(
      <MenuCard
        title="Menu Card Title"
        subtext="Sub Text Closed"
        opened={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
