/* eslint-disable react/jsx-props-no-spreading */
import { render } from '@testing-library/react-native';
import React from 'react';
import { getMockItemDetails } from '../../mockData';
import { mockConfig } from '../../mockData/mockConfig';
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

const mockOtherActionProps: OtherActionProps = {
  chosenActionState: ['', jest.fn()],
  countryCode: 'CN',
  exceptionType: null,
  getItemDetailsApi: defaultAsyncState,
  trackEventCall: jest.fn(),
  userConfigs: mockConfig
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
});
