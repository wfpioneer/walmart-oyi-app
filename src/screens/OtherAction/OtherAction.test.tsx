/* eslint-disable react/jsx-props-no-spreading */
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { strings } from '../../locales';
import { getMockItemDetails } from '../../mockData';
import mockUser from '../../mockData/mockUser';
import { AsyncState } from '../../models/AsyncState';
import { setItemDetails } from '../../state/actions/ReserveAdjustmentScreen';
import {
  OTHER_ACTIONS,
  OtherActionProps,
  OtherActionScreen,
  renderChooseActionRadioButtons
} from './OtherAction';

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
  const mockSuccessItemDetails: AsyncState = {
    ...defaultAsyncState,
    result: {
      data: getMockItemDetails('123')
    }
  };
  it('renders the OtherActionScreen', () => {
    const { toJSON } = render(
      <OtherActionScreen
        {...mockOtherActionProps}
        getItemDetailsApi={mockSuccessItemDetails}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('renders the OtherActionScreen with desired Action buttons', () => {
    const { toJSON } = render(
      <OtherActionScreen
        {...mockOtherActionProps}
        getItemDetailsApi={mockSuccessItemDetails}
        exceptionType="C"
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe('Tests OtherAction Screen buttons', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockTrackEventCall = jest.fn();
    it('Renders + Calls renderChooseActionRadioButtons', () => {
      const mockSetChosenAction = jest.fn();
      const title = 'Scan for No Action';
      const mockActionItem = { title, subText: 'No Action Required' };
      const { getByTestId, toJSON } = render(
        renderChooseActionRadioButtons(
          mockActionItem,
          mockTrackEventCall,
          title,
          mockSetChosenAction
        )
      );

      const radioButton = getByTestId('radio action button');
      fireEvent.press(radioButton);

      expect(toJSON()).toMatchSnapshot();
      expect(mockSetChosenAction).toHaveBeenCalledWith(title);
      expect(mockTrackEventCall).toHaveBeenCalledWith('other actions screen', {
        action: 'worklist_update_filter_exceptions',
        exception: title
      });
    });

    it('Calls \'continueAction\' flow', async () => {
      mockOtherActionProps.chosenActionState[0] = strings('ITEM.SCAN_FOR_NO_ACTION');
      const mockItemDetails = getMockItemDetails('123');
      const { getByTestId, update } = render(
        <OtherActionScreen
          {...mockOtherActionProps}
          getItemDetailsApi={mockSuccessItemDetails}
        />
      );
      const continueButton = getByTestId('chosen action button');
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'scan_for_no_action_click', itemNbr: mockItemDetails.itemNbr }
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('NoActionScan');

      // Edit Location Flow
      mockOtherActionProps.chosenActionState[0] = strings('LOCATION.EDIT_LOCATION');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
          getItemDetailsApi={mockSuccessItemDetails}
        />
      );
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'location_details_click', itemNbr: mockItemDetails.itemNbr }
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('LocationDetails');

      // Reserve Adjustment Flow
      mockOtherActionProps.chosenActionState[0] = strings('ITEM.CLEAN_RESERVE');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
          getItemDetailsApi={mockSuccessItemDetails}
        />
      );
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'reserve_adjustment_click', itemNbr: mockItemDetails.itemNbr }
      );
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(setItemDetails(mockItemDetails));
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('ReserveAdjustment');

      // On Hands Change Flow
      mockOtherActionProps.chosenActionState[0] = strings('APPROVAL.OH_CHANGE');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
          getItemDetailsApi={mockSuccessItemDetails}
        />
      );
      fireEvent.press(continueButton);

      mockOtherActionProps.appUser.configs.auditWorklists = true;
      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'update_OH_qty_click', itemNbr: mockItemDetails.itemNbr }
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('AuditItem');
      mockOtherActionProps.appUser.configs.auditWorklists = false;

      // Print Price Sign Flow
      mockOtherActionProps.chosenActionState[0] = strings('PRINT.PRICE_SIGN');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
          getItemDetailsApi={mockSuccessItemDetails}
        />
      );
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'print_sign_button_click', itemNbr: mockItemDetails.itemNbr }
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith(
        'PrintPriceSign',
        { screen: 'PrintPriceSignScreen' }
      );

      // Add to PickList Flow
      mockOtherActionProps.chosenActionState[0] = strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST');
    });
  });
});
