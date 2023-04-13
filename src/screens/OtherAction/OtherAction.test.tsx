/* eslint-disable react/jsx-props-no-spreading */
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';
import { getMockItemDetails } from '../../mockData';
import mockUser from '../../mockData/mockUser';
import { AsyncState } from '../../models/AsyncState';
import { OtherActionProps, OtherActionScreen } from './OtherAction';

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'mockMaterialCommunityIcons'
);
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

const defaultAsyncState: AsyncState = {
  error: null,
  isWaiting: false,
  result: null,
  value: null
};
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
  getState: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn()
};
const routeProp: RouteProp<any, string> = {
  key: 'test',
  name: 'test'
};

const mockOtherActionProps: OtherActionProps = {
  chosenActionState: ['', jest.fn()],
  exceptionType: null,
  getItemDetailsApi: defaultAsyncState,
  trackEventCall: jest.fn(),
  appUser: mockUser,
  dispatch: jest.fn(),
  navigation: navigationProp,
  route: routeProp,
  validateSessionCall: jest.fn(() => Promise.resolve())
};

describe('OtherActionScreen Tests', () => {
  it('renders the OtherActionScreen', () => {
    const mockSuccessItemDetails: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: getMockItemDetails('123')
      }
    };
    const { toJSON } = render(
      <OtherActionScreen
        {...mockOtherActionProps}
        getItemDetailsApi={mockSuccessItemDetails}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('renders the OtherActionScreen with desired Action buttons', () => {
    const mockSuccessItemDetails: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: getMockItemDetails('123')
      }
    };
    const { toJSON } = render(
      <OtherActionScreen
        {...mockOtherActionProps}
        getItemDetailsApi={mockSuccessItemDetails}
        exceptionType="C"
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
