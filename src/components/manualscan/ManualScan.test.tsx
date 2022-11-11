import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import ManualScanComponent from './ManualScan';

jest.mock('../../utils/scannerUtils.ts', () => ({
  manualScan: () => {}
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useDispatch: () => mockDispatch
  };
});
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('Test Location Manual Scan Component', () => {
  it('Renders Manual Scan component with a default keyboard type', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ManualScanComponent
        keyboardType="default"
        placeholder="Test"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders Manual Scan component with a numeric keyboard type', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ManualScanComponent
        keyboardType="numeric"
        placeholder="Test"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should set txtEntry value onchange and on clear btn click will clear the value', () => {
    const { getByTestId } = render(
      <ManualScanComponent
        keyboardType="default"
        placeholder="Test"
      />
    );
    const txtEntry = getByTestId('txtEntry');
    fireEvent.changeText(txtEntry, '1234');
    expect(txtEntry.props.value).toBe('1234');

    const clearbutton = getByTestId('clearbutton');

    fireEvent.press(clearbutton);
    expect(txtEntry.props.value).toBe('');
  });
});
