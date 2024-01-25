import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import {
  DELETE_UPCS,
  UPDATE_PALLET_ITEM_QTY,
  UPDATE_PICKLIST_STATUS,
  UPDATE_PICKLIST_STATUS_V1,
  deleteBadPallet
} from '../../state/actions/saga';
import { strings } from '../../locales';
import { mockItem } from '../../mockData/mockPickList';
import { AsyncState } from '../../models/AsyncState';
import { UseStateType } from '../../models/Generics.d';
import { PickListItem, PickStatus, Tabs } from '../../models/Picking.d';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import { PickingState } from '../../state/reducers/Picking';
import {
  ExpiryPromptShow,
  SalesFloorWorkflowScreen,
  activityIndicatorEffect,
  binApisEffect,
  binServiceCall,
  deleteBadPalletApiEffect,
  deleteBadPalletModal,
  getCurrentQuantity,
  getInitialQuantity,
  handleDecrement,
  handleIncrement,
  handleTextChange,
  onEndEditing,
  palletDetailsApiEffect,
  setPerishableCategoriesHook,
  shouldDelete,
  shouldPromptNewExpiry,
  shouldRemoveExpiry,
  shouldUpdateQty,
  updatePicklistStatusApiEffect
} from './SalesFloorWorkflow';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { UPDATE_PICKS } from '../../state/actions/Picking';
import { mockConfig } from '../../mockData/mockConfig';
import { trackEvent } from '../../utils/AppCenterTool';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
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

const pickStateMissingProps = {
  selectedPicks: [0],
  pickCreateItem: mockItem,
  pickCreateFloorLocations: [],
  pickCreateReserveLocations: [],
  selectedTab: Tabs.QUICKPICK,
  pickingMenu: false,
  multiBinEnabled: false,
  multiPickEnabled: false
};

const mockIsFocused = jest.fn(() => true);
const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: mockIsFocused,
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
  ...pickStateMissingProps
};

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.Date.now = jest.fn(() => new Date('2021-02-16T22:16:30Z').getTime());

const mockDispatch = jest.fn();

const mockSetExpiration = jest.fn();
const mockExpirationState: UseStateType<string> = ['', mockSetExpiration];

const mockSetPerishables = jest.fn();
const mockPerishablesState: UseStateType<Array<number>> = [
  [],
  mockSetPerishables
];

const mockSetExpirationShow = jest.fn();
const mockExpirationShowState: UseStateType<ExpiryPromptShow> = [
  ExpiryPromptShow.HIDDEN,
  mockSetExpirationShow
];

const mockSetConfigComplete = jest.fn();
const mockConfigCompleteState: UseStateType<boolean> = [
  false,
  mockSetConfigComplete
];

const mockSetIsReadytoComplete = jest.fn();
const mockCompletePalletState: UseStateType<boolean> = [
  false,
  mockSetIsReadytoComplete
];

const mockSetIsUpdateItems = jest.fn();
const mockUpdateItemsState: UseStateType<boolean> = [
  false,
  mockSetIsUpdateItems
];

const mockSetIsDeleteItems = jest.fn();
const mockDeleteItemsState: UseStateType<boolean> = [
  false,
  mockSetIsDeleteItems
];

const mockSetShowDeleteConfirmationModal = jest.fn();
const mockShowDeleteConfirmationState: UseStateType<boolean> = [
  false,
  mockSetShowDeleteConfirmationModal
];

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
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
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
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
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
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('shows the loading indicator over in custom delete bad pallet modal', () => {
    const renderer = ShallowRenderer.createRenderer();

    const errorAsyncState: AsyncState = {
      ...defaultAsyncState,
      error: {
        status: 418,
        message: 'Im a teapot'
      }
    };

    const apiIsWaiting: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
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
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={apiIsWaiting}
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
      ...pickStateMissingProps
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
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        updatePicklistStatusApi={defaultAsyncState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
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
      ...pickStateMissingProps,
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
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        updatePicklistStatusApi={defaultAsyncState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
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
      ...pickStateMissingProps,
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
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={showExpiryDialogState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        updatePicklistStatusApi={defaultAsyncState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
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
      ...pickStateMissingProps,
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
        updatePicklistStatusApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        palletDetailsApi={defaultAsyncState}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={showExpiryCalendarState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with additional items warning label', () => {
    const renderer = ShallowRenderer.createRenderer();
    const pickingStatewithZeroQuantity: PickingState = {
      pickList: [
        {
          ...basePickItem,
          status: PickStatus.READY_TO_WORK,
          newQuantityLeft: 0
        }
      ],
      ...pickStateMissingProps
    };

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
                }
              ]
            }
          ]
        }
      }
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={pickingStatewithZeroQuantity}
        navigation={navigationProp}
        updatePicklistStatusApi={defaultAsyncState}
        useEffectHook={jest.fn()}
        palletDetailsApi={successApi}
        expirationState={mockExpirationState}
        perishableItemsState={mockPerishablesState}
        perishableCategoriesList={[]}
        configCompleteState={mockConfigCompleteState}
        showExpiryPromptState={mockExpirationShowState}
        showActivity={false}
        updatePalletItemsApi={defaultAsyncState}
        deletePalletItemsApi={defaultAsyncState}
        completePalletState={mockCompletePalletState}
        deleteItemsState={mockDeleteItemsState}
        updateItemsState={mockUpdateItemsState}
        configs={mockConfig}
        showDeleteConfirmationState={mockShowDeleteConfirmationState}
        deleteBadPalletApi={defaultAsyncState}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('Manage SalesFloorWorkflow externalized function tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockSelectedItems: PickListItem[] = [
      {
        ...basePickItem,
        status: PickStatus.COMPLETE,
        id: 2,
        palletId: '41'
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
        navigationProp,
        successApi,
        selectedPicks,
        mockDispatch,
        mockSetExpiration,
        mockSetPerishables,
        mockSetIsReadytoComplete,
        perishableCategories,
        mockSetShowDeleteConfirmationModal
      );
      expect(mockSetPerishables).toBeCalledTimes(1);
      expect(mockSetPerishables).toBeCalledWith([2]);
      expect(mockSetExpiration).toBeCalledTimes(1);
      expect(mockSetExpiration).toBeCalledWith('tomorrows');
      expect(mockSetIsReadytoComplete).toBeCalledWith(true);
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('tests the get pallet details error with status code 204', () => {
      const failureAPI: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 204,
          data: {}
        }
      };
      const selectedPicks: PickListItem[] = [
        {
          ...basePickItem,
          status: PickStatus.READY_TO_WORK
        }
      ];
      const perishableCategories: number[] = [72];
      palletDetailsApiEffect(
        navigationProp,
        failureAPI,
        selectedPicks,
        mockDispatch,
        mockSetExpiration,
        mockSetPerishables,
        mockSetIsReadytoComplete,
        perishableCategories,
        mockSetShowDeleteConfirmationModal
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockSetPerishables).not.toBeCalled();
      expect(mockSetExpiration).not.toBeCalled();
      expect(mockSetIsReadytoComplete).not.toBeCalled();
      expect(mockDispatch).not.toBeCalled();
    });

    it('tests the get pallet details error with status code 422', () => {
      const failure422API: AsyncState = {
        ...defaultAsyncState,
        error: {
          response: {
            status: 422,
            data: {
              pallets: [
                {
                  id: '43',
                  items: [],
                  status: 204
                }
              ]
            }
          }
        }
      };
      const selectedPicks: PickListItem[] = [
        {
          ...basePickItem,
          status: PickStatus.READY_TO_WORK
        }
      ];
      palletDetailsApiEffect(
        navigationProp,
        failure422API,
        selectedPicks,
        mockDispatch,
        mockSetExpiration,
        mockSetPerishables,
        mockSetIsReadytoComplete,
        [],
        mockSetShowDeleteConfirmationModal
      );
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(true);

      failure422API.error.response.data.pallets[0].status = 207;
      palletDetailsApiEffect(
        navigationProp,
        failure422API,
        selectedPicks,
        mockDispatch,
        mockSetExpiration,
        mockSetPerishables,
        mockSetIsReadytoComplete,
        [],
        mockSetShowDeleteConfirmationModal
      );
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('tests the bin apis effect', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {},
        value: {}
      };
      const failApi: AsyncState = {
        ...defaultAsyncState,
        error: {},
        value: {}
      };

      const updateItemsCalledState: UseStateType<boolean> = [
        true,
        mockSetIsUpdateItems
      ];
      const deleteItemsCalledState: UseStateType<boolean> = [
        true,
        mockSetIsDeleteItems
      ];

      // success
      binApisEffect(
        successApi,
        successApi,
        updateItemsCalledState,
        deleteItemsCalledState,
        navigationProp,
        mockDispatch,
        mockSelectedItems,
        false
      );
      expect(mockDispatch).toBeCalledTimes(3);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({ type: UPDATE_PICKLIST_STATUS })
      );
      expect(Toast.show).not.toBeCalled();
      jest.clearAllMocks();

      // partial failure
      binApisEffect(
        successApi,
        failApi,
        updateItemsCalledState,
        deleteItemsCalledState,
        navigationProp,
        mockDispatch,
        mockSelectedItems,
        false
      );
      expect(mockDispatch).not.toBeCalled();
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(
        expect.objectContaining({
          text1: strings('PALLET.SAVE_PALLET_PARTIAL')
        })
      );
      jest.clearAllMocks();

      // complete failure
      binApisEffect(
        failApi,
        failApi,
        updateItemsCalledState,
        deleteItemsCalledState,
        navigationProp,
        mockDispatch,
        mockSelectedItems,
        false
      );
      expect(mockDispatch).not.toBeCalled();
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(
        expect.objectContaining({
          text1: strings('PALLET.SAVE_PALLET_FAILURE')
        })
      );
    });

    it('tests the bin apis effect with inProgress flag enabled', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {},
        value: {}
      };
      const updateItemsCalledState: UseStateType<boolean> = [
        true,
        mockSetIsUpdateItems
      ];
      const deleteItemsCalledState: UseStateType<boolean> = [
        true,
        mockSetIsDeleteItems
      ];

      // success
      binApisEffect(
        successApi,
        successApi,
        updateItemsCalledState,
        deleteItemsCalledState,
        navigationProp,
        mockDispatch,
        mockSelectedItems,
        true
      );
      expect(mockDispatch).toBeCalledTimes(3);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({ type: UPDATE_PICKLIST_STATUS_V1 })
      );
      expect(Toast.show).not.toBeCalled();
    });

    it('test deleteBadPalletApiEffect', async () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: ''
        }
      };
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'test'
      };

      deleteBadPalletApiEffect(
        successApi,
        navigationProp,
        mockSetShowDeleteConfirmationModal
      );
      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        position: 'bottom',
        text1: strings('PICKING.NO_PALLETS_AVAILABLE_PICK_DELETED'),
        visibilityTime: SNACKBAR_TIMEOUT
      });

      deleteBadPalletApiEffect(
        failureApi,
        navigationProp,
        mockSetShowDeleteConfirmationModal
      );
      expect(navigationProp.isFocused).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('PICKING.UPDATE_PICKLIST_STATUS_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    });

    it('tests the activity indicator hook', () => {
      const waitingState: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      // no apis going
      activityIndicatorEffect(
        defaultAsyncState,
        defaultAsyncState,
        defaultAsyncState,
        false,
        navigationProp,
        mockDispatch
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).not.toBeCalled();

      jest.clearAllMocks();
      // first api going
      activityIndicatorEffect(
        waitingState,
        defaultAsyncState,
        defaultAsyncState,
        false,
        navigationProp,
        mockDispatch
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(1);

      jest.clearAllMocks();
      // second api joins
      activityIndicatorEffect(
        waitingState,
        waitingState,
        defaultAsyncState,
        true,
        navigationProp,
        mockDispatch
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).not.toBeCalled();

      jest.clearAllMocks();
      // first api finishes
      activityIndicatorEffect(
        defaultAsyncState,
        waitingState,
        defaultAsyncState,
        true,
        navigationProp,
        mockDispatch
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).not.toBeCalled();

      jest.clearAllMocks();
      // second api finishes
      activityIndicatorEffect(
        defaultAsyncState,
        defaultAsyncState,
        defaultAsyncState,
        true,
        navigationProp,
        mockDispatch
      );
      expect(mockIsFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(1);
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

      const noPerishables = shouldRemoveExpiry(
        noPerishablePicks,
        perishableItems
      );
      const notAllPerishables = shouldRemoveExpiry(
        notAllPerishablePicks,
        perishableItems
      );
      const allPerishables = shouldRemoveExpiry(
        allPerishablePicks,
        perishableItems
      );
      const moreThanPerishables = shouldRemoveExpiry(
        moreThanPerishablePicks,
        perishableItems
      );

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

      const noPerishables = shouldPromptNewExpiry(
        noPerishablePicks,
        perishableItems
      );
      const notAllPerishables = shouldPromptNewExpiry(
        notAllPerishablePicks,
        perishableItems
      );
      const allPerishables = shouldPromptNewExpiry(
        allPerishablePicks,
        perishableItems
      );

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
      binServiceCall(
        picks,
        [],
        mockDispatch,
        '1',
        mockSetExpirationShow,
        perishableItems,
        mockSetIsUpdateItems,
        mockSetIsDeleteItems
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({ type: UPDATE_PALLET_ITEM_QTY })
      );
      expect(mockSetExpirationShow).not.toBeCalled();
      expect(mockSetIsUpdateItems).toBeCalledTimes(1);
      expect(mockSetIsDeleteItems).toBeCalledTimes(0);
      jest.clearAllMocks();

      // only delete items, no new expiry date
      binServiceCall(
        [],
        picks,
        mockDispatch,
        '1',
        mockSetExpirationShow,
        perishableItems,
        mockSetIsUpdateItems,
        mockSetIsDeleteItems
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({ type: DELETE_UPCS })
      );
      expect(mockSetExpirationShow).not.toBeCalled();
      expect(mockSetIsUpdateItems).toBeCalledTimes(0);
      expect(mockSetIsDeleteItems).toBeCalledTimes(1);
      jest.clearAllMocks();

      // only delete items, new expiry date
      binServiceCall(
        [],
        picks,
        mockDispatch,
        '1',
        mockSetExpirationShow,
        perishableItems,
        mockSetIsUpdateItems,
        mockSetIsDeleteItems,
        'yesterday'
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({ type: DELETE_UPCS })
      );
      expect(mockSetExpirationShow).toBeCalledTimes(1);
      expect(mockSetExpirationShow).toBeCalledWith(ExpiryPromptShow.HIDDEN);
      expect(mockSetIsUpdateItems).toBeCalledTimes(0);
      expect(mockSetIsDeleteItems).toBeCalledTimes(1);
      jest.clearAllMocks();

      // update and delete
      binServiceCall(
        picks,
        picks,
        mockDispatch,
        '1',
        mockSetExpirationShow,
        perishableItems,
        mockSetIsUpdateItems,
        mockSetIsDeleteItems,
        'tomorrow'
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({ type: UPDATE_PALLET_ITEM_QTY })
      );
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({ type: DELETE_UPCS })
      );
      expect(mockSetExpirationShow).toBeCalledTimes(1);
      expect(mockSetExpirationShow).toBeCalledWith(ExpiryPromptShow.HIDDEN);
      expect(mockSetIsUpdateItems).toBeCalledTimes(1);
      expect(mockSetIsDeleteItems).toBeCalledTimes(1);
    });

    it('Tests updatePicklistStatusApiEffect on 200 success for picklist status update', () => {
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
      updatePicklistStatusApiEffect(
        successApi,
        mockSelectedItems,
        mockDispatch,
        navigationProp
      );
      expect(navigationProp.goBack).toHaveBeenCalled();
      expect(mockDispatch).toBeCalledTimes(4);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistSuccess);
    });

    it('Tests updatePicklistStatusApiEffect on failure', () => {
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
      updatePicklistStatusApiEffect(
        failureApi,
        mockSelectedItems,
        mockDispatch,
        navigationProp
      );
      expect(mockDispatch).toBeCalledTimes(3);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistError);
    });

    it('Tests updatePicklistStatusApiEffect on failure when stock quantity is not updated', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: {
          response: {
            status: 400,
            data: {
              errorEnum: 'ITEM_QUANTITY_IS_MANDATORY'
            }
          }
        }
      };
      const toastUpdatePicklistError = {
        type: 'error',
        text1: strings('PICKING.ITEM_QUANTITY_IS_MANDATORY_ERROR'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      updatePicklistStatusApiEffect(
        failureApi,
        mockSelectedItems,
        mockDispatch,
        navigationProp
      );
      expect(mockDispatch).toBeCalledTimes(3);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastUpdatePicklistError);
    });

    it('Tests updatePicklistStatusApiEffect isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      updatePicklistStatusApiEffect(
        isLoadingApi,
        mockSelectedItems,
        mockDispatch,
        navigationProp
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });

    const mockQuantifiedItem: PickListItem = {
      ...basePickItem,
      quantityLeft: 5,
      newQuantityLeft: 3,
      itemQty: 2
    };

    it('tests getting the quantities of an item', () => {
      const actualInitialQuantity = getInitialQuantity(mockQuantifiedItem);
      const actualCurrentQuantity = getCurrentQuantity(mockQuantifiedItem);

      expect(actualInitialQuantity).toBe(5);
      expect(actualCurrentQuantity).toBe(3);
    });

    it('tests the increment function', () => {
      // unquantified item
      handleIncrement(basePickItem, mockDispatch, false);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UPDATE_PICKS,
        payload: [
          expect.objectContaining({
            quantityLeft: 1
          })
        ]
      });

      mockDispatch.mockReset();

      // quantity left, not max
      handleIncrement(mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UPDATE_PICKS,
        payload: [
          expect.objectContaining({
            newQuantityLeft: 4,
            itemQty: 1
          })
        ]
      });

      mockDispatch.mockReset();

      // quantity left, max
      mockQuantifiedItem.newQuantityLeft = 999;
      handleIncrement(mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).not.toHaveBeenCalled();

      // show quantity stocked true
      mockQuantifiedItem.newQuantityLeft = 3;
      handleIncrement(mockQuantifiedItem, mockDispatch, true);
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          payload: [expect.objectContaining({ itemQty: 1 })]
        })
      );
    });

    it('tests the decrement function', () => {
      // unquantified item
      handleDecrement(basePickItem, mockDispatch, false);
      expect(mockDispatch).not.toHaveBeenCalled();

      // quantified item
      mockQuantifiedItem.newQuantityLeft = 3;
      handleDecrement(mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UPDATE_PICKS,
        payload: [
          expect.objectContaining({
            newQuantityLeft: 2,
            itemQty: 3
          })
        ]
      });

      mockDispatch.mockReset();

      // zero quantity
      mockQuantifiedItem.newQuantityLeft = 0;
      handleDecrement(mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).not.toHaveBeenCalled();

      mockDispatch.mockReset();

      // show quantity stocked true
      mockQuantifiedItem.newQuantityLeft = 3;
      handleDecrement(mockQuantifiedItem, mockDispatch, true);
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          payload: [expect.objectContaining({ itemQty: 3 })]
        })
      );
    });

    it('tests the text editing', () => {
      // NaN
      handleTextChange('hello', mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).not.toHaveBeenCalled();

      // Empty text
      handleTextChange('', mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UPDATE_PICKS,
        payload: [
          expect.objectContaining({
            newQuantityLeft: NaN
          })
        ]
      });

      mockDispatch.mockReset();

      // Out of bound min
      handleTextChange('-1', mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).not.toHaveBeenCalled();

      // Out of bounds max
      handleTextChange('1000', mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).not.toHaveBeenCalled();

      // Good input
      handleTextChange('3', mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UPDATE_PICKS,
        payload: [
          expect.objectContaining({
            newQuantityLeft: 3,
            itemQty: 2
          })
        ]
      });

      mockDispatch.mockReset();

      // show quantity stocked true
      handleTextChange('2', mockQuantifiedItem, mockDispatch, true);
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          payload: [
            expect.objectContaining({
              itemQty: 3
            })
          ]
        })
      );
    });

    it('tests the onEditing function to ensure values are allowable', () => {
      // is numeric
      onEndEditing(mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).not.toHaveBeenCalled();

      // is NaN
      mockQuantifiedItem.newQuantityLeft = NaN;
      onEndEditing(mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).toHaveBeenCalled();

      mockDispatch.mockReset();

      // is non-numeric
      // @ts-expect-error forced type mismatch
      mockQuantifiedItem.newQuantityLeft = 'hello';
      onEndEditing(mockQuantifiedItem, mockDispatch, false);
      expect(mockDispatch).toHaveBeenCalled();

      mockDispatch.mockReset();

      // show quantity stocked true
      mockQuantifiedItem.newQuantityLeft = 3;
      onEndEditing(mockQuantifiedItem, mockDispatch, true);
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          payload: [
            expect.objectContaining({
              itemQty: 0
            })
          ]
        })
      );
    });
    it('Tests set perishable Categories hook', () => {
      setPerishableCategoriesHook(
        { palletId: 99 },
        [],
        mockDispatch,
        '',
        mockSetConfigComplete
      );
      expect(mockDispatch).toBeCalledTimes(1);
      setPerishableCategoriesHook(
        { palletId: 99 },
        [49],
        mockDispatch,
        '',
        mockSetConfigComplete
      );
      expect(mockDispatch).toBeCalledTimes(2);
    });
    it('tests the deleteBadPalletModal confirm and cancel buttons', () => {
      const { getByTestId } = render(
        deleteBadPalletModal(
          true,
          mockSetShowDeleteConfirmationModal,
          mockDispatch,
          defaultAsyncState,
          '0'
        )
      );

      const cancelButton = getByTestId('Cancel-Delete-Button');
      fireEvent.press(cancelButton);
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);

      const confirmButton = getByTestId('Confirm-Delete-Button');
      fireEvent.press(confirmButton);
      expect(mockDispatch).toHaveBeenCalledWith(deleteBadPallet('0'));
      expect(trackEvent).toHaveBeenCalledWith('sales_floor_workflow_screen', {
        action: 'delete_bad_pallet_click',
        palletId: '0'
      });
    });
  });
});
