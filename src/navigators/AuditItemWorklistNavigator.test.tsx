import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  AuditItemWorklistNavigatorStack,
  renderScanButton
} from './AuditItemWorklistNavigator';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('AuditItemWorklist Navigator', () => {
  it('Renders the AuditItemWorklist Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <AuditItemWorklistNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('manual-scan');
    fireEvent.press(scanButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
});
