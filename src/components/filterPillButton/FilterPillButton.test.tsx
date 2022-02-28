import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { FilterPillButton } from './FilterPillButton';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
describe('FilterPillButton Component', () => {
  test('Test Filterbutton TouchableOpacity', () => {
    const closeButton = jest.fn();
    const randomText = 'NO SALES FLOOR';
    const {
      getByTestId, getByText, queryByTestId, toJSON, getByRole
    } = render(<FilterPillButton filterText={randomText} onClosePress={closeButton} />);
    const button = getByTestId('button');
    fireEvent.press(button);
    expect(closeButton).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  test('FilterButton ShallowRender', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<FilterPillButton filterText="randomText" onClosePress={jest.fn()} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
