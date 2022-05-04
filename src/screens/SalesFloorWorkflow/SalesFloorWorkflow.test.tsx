import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { UseStateType } from '../../models/Generics.d';
import { AsyncState } from '../../models/AsyncState';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { PickingState } from '../../state/reducers/Picking';
import {
  ExpiryPromptShow,
  SalesFloorWorkflowScreen,
  activityIndicatorEffect,
  binServiceCall,
  palletConfigApiEffect,
  palletDetailsApiEffect,
  shouldDelete,
  shouldPromptNewExpiry,
  shouldRemoveExpiry,
  shouldUpdateQty
} from './SalesFloorWorkflow';
import { HIDE_ACTIVITY_MODAL, SHOW_ACTIVITY_MODAL } from '../../state/actions/Modal';
import { DELETE_UPCS, UPDATE_PALLET_ITEM_QTY } from '../../state/actions/saga';

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
  error: null,
  isWaiting: false,
  result: null,
  value: null
};

const mockIsFocused = jest.fn(() => true);
const mockAddListener = jest.fn();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const navigationProp: NavigationProp<any> = {
  addListener: mockAddListener,
  isFocused: mockIsFocused
};

const mockDispatch = jest.fn();

const mockSetExpiration = jest.fn();
const mockExpirationState: UseStateType<string> = ['', mockSetExpiration];

const mockSetPerishables = jest.fn();
const mockPerishablesState: UseStateType<Array<number>> = [[], mockSetPerishables];

const mockSetExpirationShow = jest.fn();
const mockExpirationShowState: UseStateType<ExpiryPromptShow> = [ExpiryPromptShow.HIDDEN, mockSetExpirationShow];

const mockSetConfigComplete = jest.fn();
const mockConfigCompleteState: UseStateType<boolean> = [false, mockSetConfigComplete];

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
        palletDetailsApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
        palletConfigApi={defaultAsyncState}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
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
        palletDetailsApi={waitingAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
        palletConfigApi={defaultAsyncState}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
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
        palletDetailsApi={errorAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
        palletConfigApi={defaultAsyncState}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
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

    const waitingAsyncState: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={multiPicksState}
        navigation={navigationProp}
        palletDetailsApi={waitingAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
        palletConfigApi={defaultAsyncState}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('shows the activity indicator when waiting for pallet config api', () => {
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

    const waitingAsyncState: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={multiPicksState}
        navigation={navigationProp}
        palletDetailsApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
        palletConfigApi={waitingAsyncState}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('shows the expiration date modal', () => {
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

    const showExpiryDialogState: UseStateType<ExpiryPromptShow> = [
      ExpiryPromptShow.DIALOGUE_SHOW,
      mockExpirationShowState[1]
    ];

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={multiPicksState}
        navigation={navigationProp}
        palletDetailsApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
        palletConfigApi={defaultAsyncState}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={showExpiryDialogState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('shows the expiration date modal date picker', () => {
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

    const showExpiryCalendarState: UseStateType<ExpiryPromptShow> = [
      ExpiryPromptShow.CALENDAR_SHOW,
      mockExpirationShowState[1]
    ];

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={multiPicksState}
        navigation={navigationProp}
        palletDetailsApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategories={[]}
        backupCategories=""
        palletConfigApi={defaultAsyncState}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={showExpiryCalendarState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('externalized function tests', () => {
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

    it('test getPalletConfigHook', async () => {
      const dispatch = jest.fn();
      const setConfigComplete = jest.fn();
      const successAsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            perishableCategories: [1, 8, 35, 36, 40, 41, 43, 45, 46, 47, 49, 51, 52, 53, 54, 55, 58]
          }
        }
      };
      const failureAsyncState = {
        ...defaultAsyncState,
        error: 'test'
      };

      palletConfigApiEffect(successAsyncState, dispatch, navigationProp, setConfigComplete, '1, 8');
      expect(dispatch).toBeCalledTimes(2);
      expect(setConfigComplete).toBeCalledTimes(1);

      dispatch.mockReset();
      setConfigComplete.mockReset();
      palletConfigApiEffect(failureAsyncState, dispatch, navigationProp, setConfigComplete, '1, 8');
      expect(dispatch).toBeCalledTimes(2);
      expect(setConfigComplete).toBeCalledTimes(1);
    });

    it('tests the activity indicator hook', () => {
      const waitingState: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      // no apis going
      activityIndicatorEffect(defaultAsyncState, defaultAsyncState, false, navigationProp, mockDispatch);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).not.toBeCalled();

      jest.clearAllMocks();
      // first api going
      activityIndicatorEffect(waitingState, defaultAsyncState, false, navigationProp, mockDispatch);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith({ type: SHOW_ACTIVITY_MODAL });

      jest.clearAllMocks();
      // second api joins
      activityIndicatorEffect(waitingState, waitingState, true, navigationProp, mockDispatch);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).not.toBeCalled();

      jest.clearAllMocks();
      // first api finishes
      activityIndicatorEffect(defaultAsyncState, waitingState, true, navigationProp, mockDispatch);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).not.toBeCalled();

      jest.clearAllMocks();
      // second api finishes
      activityIndicatorEffect(defaultAsyncState, defaultAsyncState, true, navigationProp, mockDispatch);
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith({ type: HIDE_ACTIVITY_MODAL });
    });

    it('tests shouldUpdateQuantity', () => {
      const defaultPick: PickListItem = {
        ...basePickItem
      };
      const presetQuantityPick: PickListItem = {
        ...basePickItem,
        quantityLeft: 54
      };
      const quantityModifiedButEqualPick: PickListItem = {
        ...basePickItem,
        quantityLeft: 54,
        newQuantityLeft: 54
      };
      const quantityModifiedPick: PickListItem = {
        ...basePickItem,
        quantityLeft: 43,
        newQuantityLeft: 34
      };
      const quantityZeroPick: PickListItem = {
        ...basePickItem,
        quantityLeft: 43,
        newQuantityLeft: 0
      };

      const defaultResult = shouldUpdateQty(defaultPick);
      const presetResult = shouldUpdateQty(presetQuantityPick);
      const modifiedEqualResult = shouldUpdateQty(quantityModifiedButEqualPick);
      const modifiedResult = shouldUpdateQty(quantityModifiedPick);
      const quantityZeroResult = shouldUpdateQty(quantityZeroPick);

      expect(defaultResult).toBe(false);
      expect(presetResult).toBe(false);
      expect(modifiedEqualResult).toBe(false);
      expect(modifiedResult).toBe(true);
      expect(quantityZeroResult).toBe(false);
    });

    it('tests shouldDelete', () => {
      const unmodifiedPick: PickListItem = {
        ...basePickItem,
        quantityLeft: 4
      };
      const modifiedPick: PickListItem = {
        ...basePickItem,
        quantityLeft: 5,
        newQuantityLeft: 4
      };
      const deletablePick: PickListItem = {
        ...basePickItem,
        quantityLeft: 4,
        newQuantityLeft: 0
      };

      const unmodifiedResult = shouldDelete(unmodifiedPick);
      const modifiedResult = shouldDelete(modifiedPick);
      const deletableResult = shouldDelete(deletablePick);

      expect(unmodifiedResult).toBe(false);
      expect(modifiedResult).toBe(false);
      expect(deletableResult).toBe(true);
    });

    it('tests shouldRemoveExpiry', () => {
      const perishableItems = [1, 3, 5];
      const noPerishablePicks: PickListItem[] = [
        { ...basePickItem, itemNbr: 2 },
        { ...basePickItem, itemNbr: 4 }
      ];
      const notAllPerishablePicks: PickListItem[] = [
        { ...basePickItem, itemNbr: 1 },
        { ...basePickItem, itemNbr: 2 },
        { ...basePickItem, itemNbr: 4 }
      ];
      const allPerishablePicks: PickListItem[] = [
        { ...basePickItem, itemNbr: 1 },
        { ...basePickItem, itemNbr: 3 },
        { ...basePickItem, itemNbr: 5 }
      ];
      const moreThanPerishablePicks: PickListItem[] = [
        { ...basePickItem, itemNbr: 1 },
        { ...basePickItem, itemNbr: 2 },
        { ...basePickItem, itemNbr: 3 },
        { ...basePickItem, itemNbr: 4 },
        { ...basePickItem, itemNbr: 5 }
      ];

      const noPerishables = shouldRemoveExpiry(noPerishablePicks, perishableItems);
      const notAllPerishables = shouldRemoveExpiry(notAllPerishablePicks, perishableItems);
      const allPerishables = shouldRemoveExpiry(allPerishablePicks, perishableItems);
      const moreThanPerishables = shouldRemoveExpiry(moreThanPerishablePicks, perishableItems);

      expect(noPerishables).toBe(false);
      expect(notAllPerishables).toBe(false);
      expect(allPerishables).toBe(true);
      expect(moreThanPerishables).toBe(true);
    });

    it('tests shouldPromptNewExpiry', () => {
      const perishableItems = [1, 3, 5];
      const noPerishablePicks: PickListItem[] = [
        { ...basePickItem, itemNbr: 2 },
        { ...basePickItem, itemNbr: 4 }
      ];
      const notAllPerishablePicks: PickListItem[] = [
        { ...basePickItem, itemNbr: 1 },
        { ...basePickItem, itemNbr: 2 },
        { ...basePickItem, itemNbr: 4 }
      ];
      const allPerishablePicks: PickListItem[] = [
        { ...basePickItem, itemNbr: 1 },
        { ...basePickItem, itemNbr: 3 },
        { ...basePickItem, itemNbr: 5 }
      ];

      const noPerishables = shouldPromptNewExpiry(noPerishablePicks, perishableItems);
      const notAllPerishables = shouldPromptNewExpiry(notAllPerishablePicks, perishableItems);
      const allPerishables = shouldPromptNewExpiry(allPerishablePicks, perishableItems);

      expect(noPerishables).toBe(false);
      expect(notAllPerishables).toBe(true);
      expect(allPerishables).toBe(false);
    });

    it('tests the binServiceCall', () => {
      const perishableItems = [1, 3, 5];
      const picks: PickListItem[] = [
        { ...basePickItem, itemNbr: 2 },
        { ...basePickItem, itemNbr: 4 }
      ];

      // only update items
      binServiceCall(picks, [], mockDispatch, 1, mockSetExpirationShow, perishableItems);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: UPDATE_PALLET_ITEM_QTY }));
      expect(mockSetExpirationShow).not.toBeCalled();
      jest.clearAllMocks();

      // only delete items, no new expiry date
      binServiceCall([], picks, mockDispatch, 1, mockSetExpirationShow, perishableItems);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: DELETE_UPCS }));
      expect(mockSetExpirationShow).not.toBeCalled();
      jest.clearAllMocks();

      // only delete items, new expiry date
      binServiceCall([], picks, mockDispatch, 1, mockSetExpirationShow, perishableItems, 'yesterday');
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: DELETE_UPCS }));
      expect(mockSetExpirationShow).toBeCalledTimes(1);
      expect(mockSetExpirationShow).toBeCalledWith(ExpiryPromptShow.HIDDEN);
      jest.clearAllMocks();

      // update and delete
      binServiceCall(picks, picks, mockDispatch, 1, mockSetExpirationShow, perishableItems, 'tomorrow');
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: UPDATE_PALLET_ITEM_QTY }));
      expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: DELETE_UPCS }));
      expect(mockSetExpirationShow).toBeCalledTimes(1);
      expect(mockSetExpirationShow).toBeCalledWith(ExpiryPromptShow.HIDDEN);
    });
  });
});
