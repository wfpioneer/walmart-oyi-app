import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { PalletWorklist } from './PalletWorklist';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'mockMaterialIcons');

describe('PalletWorkListScreen', () => {
  it('Test renders default PalletWorkList Screen', () => {
    const mockUpdateToggle = jest.fn();
    const { toJSON, getByTestId } = render(
      <PalletWorklist groupToggle={false} updateGroupToggle={mockUpdateToggle} />
    );

    const menuToggle = getByTestId('menu');
    const listToggle = getByTestId('list');

    fireEvent.press(menuToggle)
    expect(mockUpdateToggle).toHaveBeenCalledWith(false);

    fireEvent.press(listToggle);
    expect(mockUpdateToggle).toHaveBeenCalledWith(true);
    expect(toJSON()).toMatchSnapshot();
  });
});
