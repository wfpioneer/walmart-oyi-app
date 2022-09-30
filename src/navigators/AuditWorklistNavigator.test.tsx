import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { AuditWorklistNavigatorStack, renderScanButton } from './AuditWorklistNavigator';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};
describe('AuditItemWorklist Navigator', () => {
  it('Renders the AuditItemWorklist Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <AuditWorklistNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        auditWorklists={false}
        navigation={navigationProp}
        menuOpen={false}
        isBottomTabEnabled={true}
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
