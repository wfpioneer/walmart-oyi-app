import { NavigationProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { WorklistItem } from './WorklistItem';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('../../state/actions/Global', () => ({
  setScannedEvent: () => ({ type: 'test' })
}));

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

describe('WorklistItem Component', () => {
  it('Renders an WorklistItem component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <WorklistItem
        exceptionType="NP"
        itemDescription="Test"
        itemNumber={1234}
        navigation={navigationProp}
        dispatch={jest.fn}
        trackEventSource={{
          screen: 'worklist_item',
          action: 'worklist_item_click',
          otherInfo: { upc: 1234, itemNbr: 1234, itemDescription: 'Test' }
        }}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should call action setScannedEvent on card click', () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <WorklistItem
        exceptionType="NP"
        itemDescription="Test"
        itemNumber={1234}
        navigation={navigationProp}
        dispatch={mockDispatch}
        trackEventSource={{
          screen: 'worklist_item',
          action: 'worklist_item_click',
          otherInfo: { upc: 1234, itemNbr: 1234, itemDescription: 'Test' }
        }}
      />
    );
    const btnCard = getByTestId('btnCard');
    fireEvent.press(btnCard);
    expect(mockDispatch).toBeCalledWith({ type: 'test' });
  });
});
