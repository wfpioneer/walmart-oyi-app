/* eslint-disable react/jsx-props-no-spreading */
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { strings } from '../../locales';
import mockItemDetails from '../../mockData/getItemDetails';
import mockUser from '../../mockData/mockUser';
import { setAuditItemNumber } from '../../state/actions/AuditWorklist';
import { resetScannedEvent } from '../../state/actions/Global';
import { setPickCreateFloor, setPickCreateItem, setPickCreateReserve } from '../../state/actions/Picking';
import { setItemDetails } from '../../state/actions/ReserveAdjustmentScreen';
import {
  DesiredActionButton,
  OTHER_ACTIONS,
  OtherActionProps,
  OtherActionScreen,
  renderChooseActionRadioButtons
} from './OtherAction';
import User from '../../models/User';

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'mockMaterialCommunityIcons'
);
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

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
  itemDetails: mockItemDetails[654],
  trackEventCall: jest.fn(),
  appUser: mockUser,
  dispatch: jest.fn(),
  navigation: navigationProp,
  route: routeProp,
  validateSessionCall: jest.fn(() => Promise.resolve()),
  floorLocations: [],
  reserveLocations: []
};

describe('OtherActionScreen Tests', () => {
  it('renders the OtherActionScreen', () => {
    const { toJSON } = render(
      <OtherActionScreen
        {...mockOtherActionProps}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('renders the OtherActionScreen with desired Action buttons', () => {
    const mockOHUser: User = { ...mockUser, features: ['on hands change'] };
    const { toJSON } = render(
      <OtherActionScreen
        {...mockOtherActionProps}
        appUser={mockOHUser}
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
      const mockActionItem: DesiredActionButton = { title, subText: 'No Action Required', isDisabled: false };
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
      const { getByTestId, update } = render(
        <OtherActionScreen
          {...mockOtherActionProps}
        />
      );
      const continueButton = getByTestId('chosen action button');
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'scan_for_no_action_click', itemNbr: mockItemDetails[654].itemNbr }
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('NoActionScan');

      // Edit Location Flow
      mockOtherActionProps.chosenActionState[0] = strings('LOCATION.EDIT_LOCATION');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
        />
      );
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'location_details_click', itemNbr: mockItemDetails[654].itemNbr }
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('LocationDetails');

      // Reserve Adjustment Flow
      mockOtherActionProps.chosenActionState[0] = strings('ITEM.CLEAN_RESERVE');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
        />
      );
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'reserve_adjustment_click', itemNbr: mockItemDetails[654].itemNbr }
      );
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(setItemDetails(mockItemDetails[654]));
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(resetScannedEvent());
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('ReserveAdjustment');

      // On Hands Change Flow
      mockOtherActionProps.chosenActionState[0] = strings('APPROVAL.OH_CHANGE');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
        />
      );
      fireEvent.press(continueButton);

      mockOtherActionProps.appUser.configs.auditWorklists = true;
      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'update_OH_qty_click', itemNbr: mockItemDetails[654].itemNbr }
      );
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(setAuditItemNumber(mockItemDetails[654].itemNbr));
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(resetScannedEvent());
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('AuditItem');
      mockOtherActionProps.appUser.configs.auditWorklists = false;

      // Print Price Sign Flow
      mockOtherActionProps.chosenActionState[0] = strings('PRINT.PRICE_SIGN');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
        />
      );
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'print_sign_button_click', itemNbr: mockItemDetails[654].itemNbr }
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith(
        'PrintPriceSign',
        { screen: 'PrintPriceSignScreen' }
      );

      // Add to PickList Flow
      mockOtherActionProps.chosenActionState[0] = strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST');
      update(
        <OtherActionScreen
          {...mockOtherActionProps}
          floorLocations={mockItemDetails[654]?.location?.floor || []}
          reserveLocations={mockItemDetails[654]?.location?.reserve || []}
        />
      );
      fireEvent.press(continueButton);

      expect(mockOtherActionProps.validateSessionCall).toHaveBeenCalled();
      expect(await mockOtherActionProps.trackEventCall).toHaveBeenCalledWith(
        OTHER_ACTIONS,
        { action: 'add_to_picklist_click', itemNbr: mockItemDetails[654].itemNbr }
      );
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(setPickCreateItem({
        itemName: mockItemDetails[654].itemName,
        itemNbr: mockItemDetails[654].itemNbr,
        upcNbr: mockItemDetails[654].upcNbr,
        categoryNbr: mockItemDetails[654].categoryNbr,
        categoryDesc: mockItemDetails[654].categoryDesc,
        price: mockItemDetails[654].price
      }));
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(
        setPickCreateFloor(mockItemDetails[654]?.location?.floor || [])
      );
      expect(await mockOtherActionProps.dispatch).toHaveBeenCalledWith(
        setPickCreateReserve(mockItemDetails[654]?.location?.reserve || [])
      );
      expect(await mockOtherActionProps.navigation.navigate).toHaveBeenCalledWith('Picking', { screen: 'CreatePick' });
    });
  });
});
