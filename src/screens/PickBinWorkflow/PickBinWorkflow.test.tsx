import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import {
  PickAction, PickListItem, PickStatus, Tabs
} from '../../models/Picking.d';
import { PickingState } from '../../state/reducers/Picking';
import {
  ContinueActionDialog, PickBinWorkflowScreen,
  updatePalletNotFoundApiHook, updatePicklistStatusApiHook
} from './PickBinWorkflowScreen';
import { AsyncState } from '../../models/AsyncState';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { strings } from '../../locales';
import { mockItem } from '../../mockData/mockPickList';
import { SNACKBAR_TIMEOUT, SNACKBAR_TIMEOUT_LONG } from '../../utils/global';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

const basePickItem: PickListItem = {
  assignedAssociate: '',
  category: 3,
  createTs: '2022-04-03T12:55:31.9633333Z',
  createdBy: 'Guude',
  id: 0,
  itemDesc: 'generic description',
  itemNbr: 1,
  moveToFront: false,
  palletId: '43',
  palletLocationId: 4,
  palletLocationName: 'ABAR1-2',
  quickPick: false,
  salesFloorLocationId: 5,
  salesFloorLocationName: 'ABAR1-3',
  status: PickStatus.DELETED,
  upcNbr: '1234567890123'
};

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
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
const pickStateMissingProps = {
  selectedPicks: [0],
  pickCreateItem: mockItem,
  pickCreateFloorLocations: [],
  pickCreateReserveLocations: [],
  selectedTab: Tabs.QUICKPICK
};
const pickingState: PickingState = {
  pickList: [
    {
      ...basePickItem,
      assignedAssociate: 't0s0og',
      status: PickStatus.ACCEPTED_BIN
    },
    {
      ...basePickItem,
      assignedAssociate: 't0s0og',
      status: PickStatus.ACCEPTED_PICK,
      id: 1,
      palletId: '40'
    },
    {
      ...basePickItem,
      status: PickStatus.READY_TO_PICK,
      id: 2,
      palletId: '41'
    },
    {
      ...basePickItem,
      id: 3,
      status: PickStatus.READY_TO_BIN,
      palletId: '42'
    },
    {
      ...basePickItem,
      id: 4,
      status: PickStatus.READY_TO_BIN,
      palletId: '42'
    },
    {
      ...basePickItem,
      assignedAssociate: 'vn50pz4',
      id: 5,
      status: PickStatus.ACCEPTED_PICK,
      quickPick: true,
      palletId: '44'
    },
    {
      ...basePickItem,
      assignedAssociate: 'vn50pz4',
      id: 6,
      status: PickStatus.ACCEPTED_BIN,
      palletId: '45',
      palletLocationId: 5,
      palletLocationName: 'ABAR1-4',
      quickPick: true
    }
  ],
  ...pickStateMissingProps
};

describe('PickBin Workflow render tests', () => {
  it('renders screen with ready to pick item selected', () => {
    const renderer = ShallowRenderer.createRenderer();

    const readyToPickPicks: PickingState = {
      ...pickingState,
      selectedPicks: [2]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={readyToPickPicks}
        userFeatures={[]}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with ready to bin items selected', () => {
    const renderer = ShallowRenderer.createRenderer();

    const readyToBinPicks: PickingState = {
      ...pickingState,
      selectedPicks: [3, 4]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={readyToBinPicks}
        userFeatures={[]}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted pick & current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const myAcceptedPicks: PickingState = {
      ...pickingState,
      selectedPicks: [5]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={myAcceptedPicks}
        userFeatures={[]}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted pick and not current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedPick: PickingState = {
      ...pickingState,
      selectedPicks: [1]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedPick}
        userFeatures={[]}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted pick, not current user, and manager', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedPick: PickingState = {
      ...pickingState,
      selectedPicks: [1]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedPick}
        userFeatures={['manager approval']}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted bin & current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const myAcceptedBin: PickingState = {
      ...pickingState,
      selectedPicks: [6]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={myAcceptedBin}
        userFeatures={[]}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted bin & not current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedBin: PickingState = {
      ...pickingState,
      selectedPicks: [0]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedBin}
        userFeatures={[]}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted bin, not current user, and manager', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedBin: PickingState = {
      ...pickingState,
      selectedPicks: [0]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedBin}
        userFeatures={['manager approval']}
        userId="vn50pz4"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={jest.fn}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={jest.fn()}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Tests PickBinWorkflow component and calls Accept action for updating the picklist', async () => {
    const mockPickState: PickingState = {
      pickList: [
        {
          ...basePickItem,
          assignedAssociate: 'vn51wu8',
          status: PickStatus.READY_TO_PICK
        },
        {
          ...basePickItem,
          assignedAssociate: 't0s0og',
          status: PickStatus.ACCEPTED_PICK,
          id: 1,
          palletId: '40'
        }
      ],
      ...pickStateMissingProps
    };
    const mockDispatch = jest.fn();
    const setSelectedPicklistAction = jest.fn();
    const { findByText, queryAllByText } = render(
      <PickBinWorkflowScreen
        pickingState={mockPickState}
        userFeatures={['manager approval']}
        userId="vn51wu8"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={mockDispatch}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={setSelectedPicklistAction}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );
    const acceptButton = findByText(strings('PICKING.ACCEPT'));
    fireEvent.press(await acceptButton);
    expect(queryAllByText(strings('PICKING.RELEASE'))).toHaveLength(0);
    expect(queryAllByText(strings('GENERICS.CONTINUE'))).toHaveLength(0);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(setSelectedPicklistAction).toBeCalledTimes(1);
  });

  it('Tests PickBinWorkflow component and calls Release action for updating the picklist', async () => {
    const mockPickState: PickingState = {
      pickList: [
        {
          ...basePickItem,
          assignedAssociate: 'vn51wu8',
          status: PickStatus.ACCEPTED_PICK
        },
        {
          ...basePickItem,
          assignedAssociate: 't0s0og',
          status: PickStatus.ACCEPTED_PICK,
          id: 1,
          palletId: '40'
        }
      ],
      ...pickStateMissingProps
    };
    const mockDispatch = jest.fn();
    const setSelectedPicklistAction = jest.fn();
    const { findByText, queryAllByText } = render(
      <PickBinWorkflowScreen
        pickingState={mockPickState}
        userFeatures={['manager approval']}
        userId="vn51wu8"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={mockDispatch}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={setSelectedPicklistAction}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );
    const releaseButton = findByText(strings('PICKING.RELEASE'));
    fireEvent.press(await releaseButton);
    expect(queryAllByText(strings('PICKING.ACCEPT'))).toHaveLength(0);
    expect(queryAllByText(strings('GENERICS.CONTINUE'))).toHaveLength(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(setSelectedPicklistAction).toBeCalledTimes(1);
  });

  it('Tests Binning Navigation while clicking on Bin button', async () => {
    const mockPickState: PickingState = {
      pickList: [
        {
          ...basePickItem,
          assignedAssociate: 'vn51wu8',
          status: PickStatus.ACCEPTED_BIN
        },
        {
          ...basePickItem,
          assignedAssociate: 't0s0og',
          status: PickStatus.ACCEPTED_BIN,
          id: 1,
          palletId: '40'
        }
      ],
      ...pickStateMissingProps
    };
    const mockDispatch = jest.fn();
    const setSelectedPicklistAction = jest.fn();
    const { findByText } = render(
      <PickBinWorkflowScreen
        pickingState={mockPickState}
        userFeatures={['']}
        userId="vn51wu8"
        updatePicklistStatusApi={defaultAsyncState}
        updatePalletNotFoundApi={defaultAsyncState}
        useEffectHook={jest.fn}
        dispatch={mockDispatch}
        navigation={navigationProp}
        selectedPicklistAction={null}
        setSelectedPicklistAction={setSelectedPicklistAction}
        showContinueActionDialog={false}
        setShowContinueActionDialog={jest.fn}
      />
    );
    const binButton = findByText(strings('PICKING.BIN'));
    fireEvent.press(await binButton);
    expect(navigationProp.navigate).toHaveBeenCalled();
    expect(mockDispatch).toBeCalledTimes(1);
  });

  describe('ContinueActionDialog render tests', () => {
    const mockSetSelectedPicklistAction = jest.fn();
    const mockSetShowContinueActionDialog = jest.fn();
    const mockDispatch = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockSelectedItems: PickListItem[] = [
      {
        ...basePickItem,
        status: PickStatus.ACCEPTED_BIN,
        id: 2,
        palletId: '41'
      }
    ];
    it('renders dialog with different coninue actions for the selected picks', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ContinueActionDialog
          showContinueActionDialog={true}
          setShowContinueActionDialog={jest.fn}
          dispatch={jest.fn}
          items={mockSelectedItems}
          setSelectedPicklistAction={jest.fn}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('tests readyToWork action functionality', async () => {
      const { findByText } = render(
        <ContinueActionDialog
          showContinueActionDialog={true}
          setShowContinueActionDialog={mockSetShowContinueActionDialog}
          dispatch={mockDispatch}
          items={mockSelectedItems}
          setSelectedPicklistAction={mockSetSelectedPicklistAction}
        />
      );
      const readyToWorkActionButton = findByText(strings('PICKING.READY_TO_WORK'));
      fireEvent.press(await readyToWorkActionButton);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockSetSelectedPicklistAction).toHaveBeenCalledWith(PickAction.READY_TO_WORK);
      expect(mockSetShowContinueActionDialog).toHaveBeenCalledWith(false);
    });
    it('tests complete action functionality', async () => {
      const { findByText } = render(
        <ContinueActionDialog
          showContinueActionDialog={true}
          setShowContinueActionDialog={mockSetShowContinueActionDialog}
          dispatch={mockDispatch}
          items={mockSelectedItems}
          setSelectedPicklistAction={mockSetSelectedPicklistAction}
        />
      );
      const completeActionButton = findByText(strings('PICKING.COMPLETE'));
      fireEvent.press(await completeActionButton);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockSetSelectedPicklistAction).toHaveBeenCalledWith(PickAction.COMPLETE);
      expect(mockSetShowContinueActionDialog).toHaveBeenCalledWith(false);
    });
    it('tests cancel action functionality', async () => {
      const { findByText } = render(
        <ContinueActionDialog
          showContinueActionDialog={true}
          setShowContinueActionDialog={mockSetShowContinueActionDialog}
          dispatch={mockDispatch}
          items={mockSelectedItems}
          setSelectedPicklistAction={mockSetSelectedPicklistAction}
        />
      );
      const cancelButton = findByText(strings('GENERICS.CANCEL'));
      fireEvent.press(await cancelButton);
      expect(mockSetShowContinueActionDialog).toHaveBeenCalledWith(false);
    });
  });

  describe('Manage PickBinWorkflow externalized function tests', () => {
    const mockDispatch = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockSelectedItems: PickListItem[] = [
      {
        ...basePickItem,
        status: PickStatus.ACCEPTED_BIN,
        id: 2,
        palletId: '41'
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
      updatePicklistStatusApiHook(successApi, mockSelectedItems, mockDispatch, navigationProp, PickAction.RELEASE);
      expect(navigationProp.goBack).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(2);
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
      updatePicklistStatusApiHook(failureApi, mockSelectedItems, mockDispatch, navigationProp, PickAction.ACCEPT_BIN);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistError);
    });

    it('Tests updatePicklistStatusApiHook isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      updatePicklistStatusApiHook(isLoadingApi, mockSelectedItems, mockDispatch, navigationProp, PickAction.ACCEPT_BIN);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });

    it('Tests updatePalletNotFoundApiHook on 200 success and picks been created', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            message: 'AT_LEAST_ONE_PICK_CREATED'
          }
        }
      };
      const toastUpdatePicklistSuccess = {
        type: 'success',
        text1: strings('PICKING.NEW_PICK_ADDED_TO_PICKLIST'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      };
      updatePalletNotFoundApiHook(successApi, mockSelectedItems, mockDispatch, navigationProp);
      expect(navigationProp.goBack).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistSuccess);
    });

    it('Tests updatePalletNotFoundApiHook on 200 success without created any picks', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {}
        }
      };
      const toastUpdatePicklistSuccess = {
        type: 'success',
        text1: strings('PICKING.NO_PALLETS_AVAILABLE_PICK_DELETED'),
        visibilityTime: SNACKBAR_TIMEOUT_LONG,
        position: 'bottom'
      };
      updatePalletNotFoundApiHook(successApi, mockSelectedItems, mockDispatch, navigationProp);
      expect(navigationProp.goBack).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistSuccess);
    });

    it('Tests updatePalletNotFoundApiHook on failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Internal Server Error'
      };
      const toastUpdatePicklistError = {
        type: 'error',
        text1: strings('PICKING.UPDATE_PICK_FAILED_TRY_AGAIN'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      };
      updatePalletNotFoundApiHook(failureApi, mockSelectedItems, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistError);
    });

    it('Tests updatePalletNotFoundApiHook isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      updatePalletNotFoundApiHook(isLoadingApi, mockSelectedItems, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });
  });
});
