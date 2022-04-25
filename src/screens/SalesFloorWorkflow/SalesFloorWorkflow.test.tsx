import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../locales';
import { AsyncState } from '../../models/AsyncState';
import { Pallet } from '../../models/PalletManagementTypes';
import { UseStateType } from '../../models/Generics.d';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { PickingState } from '../../state/reducers/Picking';
import { SalesFloorWorkflowScreen, palletDetailsApiEffect, updatePicklistStatusApiHook } from './SalesFloorWorkflow';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

const basePickItem: PickListItem = {
  assignedAssociate: '',
  category: 3,
  createTS: 'yesterday',
  createdBy: 'Guude',
  id: 0,
  itemDesc: 'generic description',
  itemNbr: 1,
  moveToFront: false,
  palletId: 43,
  palletLocationId: 4,
  palletLocationName: 'ABAR1-2',
  quickPick: false,
  salesFloorLocationId: 5,
  salesFloorLocationName: 'ABAR1-3',
  status: PickStatus.DELETED,
  upcNbr: '1234567890123'
};

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};

const pickingState: PickingState = {
  pickList: [
    {
      ...basePickItem,
      status: PickStatus.READY_TO_WORK
    }
  ],
  selectedPicks: [0]
};

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

const mockDispatch = jest.fn();

const mockSetExpiration = jest.fn();
const mockExpirationState: UseStateType<string> = ['', mockSetExpiration];

const mockSetPerishables = jest.fn();
const mockPerishablesState: UseStateType<Array<number>> = [[], mockSetPerishables];

describe('Sales floor workflow tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the screen with one item on pallet', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={pickingState}
        navigation={navigationProp}
        updatePicklistStatusApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        palletDetailsApi={defaultAsyncState}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with several items on the pallet', () => {
    const renderer = ShallowRenderer.createRenderer();

    const waitingAsyncState: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={pickingState}
        navigation={navigationProp}
        updatePicklistStatusApi={defaultAsyncState}
        palletDetailsApi={waitingAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('shows the retry button when get pallet details errors', () => {
    const renderer = ShallowRenderer.createRenderer();

    const errorAsyncState: AsyncState = {
      ...defaultAsyncState,
      error: {
        status: 418,
        message: 'Im a teapot'
      }
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={pickingState}
        navigation={navigationProp}
        updatePicklistStatusApi={defaultAsyncState}
        palletDetailsApi={errorAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('shows the activity indicator when waiting for pallet details', () => {
    const renderer = ShallowRenderer.createRenderer();

    const multiPicksState: PickingState = {
      pickList: [
        ...pickingState.pickList,
        {
          ...basePickItem,
          id: 1,
          status: PickStatus.READY_TO_WORK
        }
      ],
      selectedPicks: [0]
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={multiPicksState}
        navigation={navigationProp}
        updatePicklistStatusApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        palletDetailsApi={defaultAsyncState}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
      />
    );
  });

  describe('Manage SalesFloorWorkflow externalized function tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockSelectedItems = [
      {
        ...basePickItem,
        status: PickStatus.COMPLETE,
        id: 2,
        palletId: 41
      }
    ];
    it('tests the get pallet details to get quantities, success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            pallets: [
              {
                id: 43,
                createDate: 'yesterday',
                expirationDate: 'tomorrows',
                items: [
                  {
                    itemNbr: 2,
                    itemDesc: 'ye olde yo',
                    price: 2.99,
                    upc: '1234567890',
                    quantity: 6,
                    categoryNbr: 72
                  },
                  {
                    itemNbr: 1,
                    itemDesc: 'Zweite Sache',
                    price: 4.92,
                    upc: '9876543210',
                    quantity: 8,
                    categoryNbr: 34
                  },
                  {
                    itemNbr: 3,
                    itemDesc: 'Dritte Sache',
                    price: 4.22,
                    upc: '1029384756',
                    quantity: 65443,
                    categoryNbr: 2
                  }
                ]
              }
            ]
          }
        }
      };
      const selectedPicks: PickListItem[] = [
        {
          ...basePickItem,
          status: PickStatus.READY_TO_WORK
        },
        {
          ...basePickItem,
          status: PickStatus.READY_TO_WORK,
          id: 1,
          itemNbr: 2
        }
      ];
      const perishableCategories: number[] = [72];
      palletDetailsApiEffect(
        navigationProp, successApi, selectedPicks,
        mockDispatch, mockSetExpiration, mockSetPerishables, perishableCategories
      );
      expect(mockSetPerishables).toBeCalledTimes(1);
      expect(mockSetPerishables).toBeCalledWith([2]);
      expect(mockSetExpiration).toBeCalledTimes(1);
      expect(mockSetExpiration).toBeCalledWith('tomorrows');
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('Tests updatePicklistStatusApiHook on 200 success for picklist status update', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200
        }
      };
      const toastUpdatePicklistSuccess = {
        type: 'success',
        text1: strings('PICKING.UPDATE_PICKLIST_STATUS_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      updatePicklistStatusApiHook(successApi, mockSelectedItems, mockDispatch, navigationProp);
      expect(navigationProp.goBack).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(3);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistSuccess);
    });

    it('Tests updatePicklistStatusApiHook on failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Internal Server Error'
      };
      const toastUpdatePicklistError = {
        type: 'error',
        text1: strings('PICKING.UPDATE_PICKLIST_STATUS_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      updatePicklistStatusApiHook(failureApi, mockSelectedItems, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistError);
    });

    it('Tests updatePicklistStatusApiHook isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      updatePicklistStatusApiHook(isLoadingApi, mockSelectedItems, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });
  });
});
