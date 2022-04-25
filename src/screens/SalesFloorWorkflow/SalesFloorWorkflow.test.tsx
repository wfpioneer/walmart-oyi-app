import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../locales';
import { AsyncState } from '../../models/AsyncState';
import { Pallet } from '../../models/PalletManagementTypes';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { PickingState } from '../../state/reducers/Picking';
import { SalesFloorWorkflowScreen, updatePicklistStatusApiHook } from './SalesFloorWorkflow';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

const testPallet: Pallet = {
  items: [],
  palletInfo: {
    id: 1,
    createDate: 'yesterday'
  }
};

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

describe('Sales floor workflow tests', () => {
  it('renders the screen with one item on pallet', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={pickingState}
        palletToWork={testPallet}
        navigation={navigationProp}
        updatePicklistStatusApi={defaultAsyncState}
        useEffectHook={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with several items on the pallet', () => {
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
      selectedPicks: [0, 1]
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={multiPicksState}
        palletToWork={testPallet}
        navigation={navigationProp}
        updatePicklistStatusApi={defaultAsyncState}
        useEffectHook={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('Manage SalesFloorWorkflow externalized function tests', () => {
    const mockDispatch = jest.fn();
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
