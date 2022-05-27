import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import _ from 'lodash';
import Toast from 'react-native-toast-message';
import { fireEvent, render } from '@testing-library/react-native';
import ItemDetails from '../../models/ItemDetails';
import {
  PrintPriceSignScreen,
  aisleSectionExists,
  checkQuantity,
  getPrinter,
  handleAddPrintList,
  handleChangePrinter,
  handlePrint,
  isErrorRequired,
  isItemSizeExists,
  isValidDispatch,
  navListenerHook,
  printLocationApiHook,
  printPalletApiHook,
  printSignApiHook,
  renderSignSizeButtons,
  selectQuantityView,
  setHandleDecreaseQty,
  setHandleIncreaseQty,
  setPrinterLayoutHook,
  validateQty
} from './PrintPriceSign';
import mockItemDetails from '../../mockData/getItemDetails';
import { PrintQueueItem, Printer, PrinterType } from '../../models/Printer';
import { strings } from '../../locales';
import { LocationName } from '../../models/Location';
import { mockConfig } from '../../mockData/mockConfig';
import { AsyncState } from '../../models/AsyncState';
import {
  mockLocationPrintQueue,
  mockPrintQueue
} from '../../mockData/mockPrintQueue';
import { mockSections } from '../../mockData/sectionDetails';
import { LocationIdName } from '../../state/reducers/Location';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';

// Something gets into a weird state, and this seems to fix it
jest.useFakeTimers();
jest.mock('../../utils/AppCenterTool', () => {
  const mockAppCenter = jest.requireActual(
    '../../utils/__mocks__/AppCenterTool'
  );
  return {
    ...mockAppCenter,
    trackEvent: jest.fn()
  };
});
jest.mock('../../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

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

const routeProp: Route<any> = {
  key: '',
  name: 'PrintPriceSign'
};
describe('PrintPriceSignScreen', () => {
  const defaultError = {
    error: false,
    message: ''
  };
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const defaultScanEvent = {
    value: '123',
    type: 'manual'
  };
  const defaultPrinter: Printer = {
    type: PrinterType.LASER,
    name: 'Front desk printer',
    desc: 'Default',
    id: '123000000000',
    labelsAvailable: ['price']
  };
  const testItem: ItemDetails = mockItemDetails[123]; // consistency
  const emptyLocation = { id: 0, name: '' };
  const nonemptyLocation = { id: 1, name: 'yes' };
  const mockPalletInfo = { id: '6' };
  const mockPrinterList = [
    {
      type: 0,
      name: 'Front desk printer',
      desc: 'Default',
      labelsAvailable: ['price'],
      id: '000000000000'
    }
  ];
  const mockUserConfig = {
    ...mockConfig,
    locationManagement: true,
    palletManagement: true,
    printingUpdate: true
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Tests rendering print Errors/Api responses', () => {
    // Double Test here???
    const apiIsWaiting = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };

    it(' Renders Loader waiting for Print Sign Service response  ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          printAPI={apiIsWaiting}
          printLabelAPI={defaultAsyncState}
          printPalletAPI={defaultAsyncState}
          palletInfo={mockPalletInfo}
          itemResult={testItem}
          sectionsResult={null}
          selectedPrinter={defaultPrinter}
          selectedSignType="XSmall"
          printQueue={[]}
          locationPrintQueue={[]}
          printingLocationLabels=""
          printingPalletLabel={false}
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          selectedZone={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={1}
          setSignQty={jest.fn()}
          isValidQty={true}
          setIsValidQty={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
          printerList={mockPrinterList}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it(' Renders Loader waiting for Print Label Service response  ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          printAPI={defaultAsyncState}
          printLabelAPI={apiIsWaiting}
          printPalletAPI={defaultAsyncState}
          palletInfo={mockPalletInfo}
          itemResult={testItem}
          sectionsResult={null}
          selectedPrinter={defaultPrinter}
          selectedSignType="XSmall"
          printQueue={[]}
          locationPrintQueue={[]}
          printingLocationLabels=""
          printingPalletLabel={false}
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          selectedZone={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={1}
          setSignQty={jest.fn()}
          isValidQty={true}
          setIsValidQty={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
          printerList={mockPrinterList}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it(' Renders Loader waiting for Print Pallet Label Service response  ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          printAPI={defaultAsyncState}
          printLabelAPI={defaultAsyncState}
          printPalletAPI={apiIsWaiting}
          palletInfo={mockPalletInfo}
          itemResult={testItem}
          sectionsResult={null}
          selectedPrinter={defaultPrinter}
          selectedSignType="XSmall"
          printQueue={[]}
          locationPrintQueue={[]}
          printingLocationLabels=""
          printingPalletLabel={true}
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          selectedZone={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={1}
          setSignQty={jest.fn()}
          isValidQty={true}
          setIsValidQty={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
          printerList={mockPrinterList}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it(' Renders Print Service Api Error', () => {
      const renderer = ShallowRenderer.createRenderer();
      const printingError = {
        error: true,
        message: strings('PRINT.PRINT_SERVICE_ERROR')
      };
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          itemResult={testItem}
          printAPI={defaultAsyncState}
          printLabelAPI={defaultAsyncState}
          printPalletAPI={defaultAsyncState}
          palletInfo={mockPalletInfo}
          sectionsResult={null}
          selectedPrinter={defaultPrinter}
          selectedSignType="XSmall"
          printQueue={[]}
          locationPrintQueue={[]}
          printingLocationLabels=""
          printingPalletLabel={false}
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          selectedZone={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={1}
          setSignQty={jest.fn()}
          isValidQty={true}
          setIsValidQty={jest.fn()}
          error={printingError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
          printerList={mockPrinterList}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it(' Renders OH Update Error for invalid amount of copies ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const invalidSignQty = 101;
      const invalidQty = false;
      renderer.render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          itemResult={testItem}
          printAPI={defaultAsyncState}
          printLabelAPI={defaultAsyncState}
          printPalletAPI={defaultAsyncState}
          palletInfo={mockPalletInfo}
          sectionsResult={null}
          selectedPrinter={defaultPrinter}
          selectedSignType="XSmall"
          printQueue={[]}
          locationPrintQueue={[]}
          printingLocationLabels=""
          printingPalletLabel={false}
          selectedAisle={_.cloneDeep(emptyLocation)}
          selectedSection={_.cloneDeep(emptyLocation)}
          selectedZone={_.cloneDeep(emptyLocation)}
          dispatch={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          signQty={invalidSignQty}
          setSignQty={jest.fn()}
          isValidQty={invalidQty}
          setIsValidQty={jest.fn()}
          error={defaultError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
          printerList={mockPrinterList}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  it('renders the Print Price Sign Screen when section labels', () => {
    const renderer = ShallowRenderer.createRenderer();
    const invalidQty = false;
    renderer.render(
      <PrintPriceSignScreen
        scannedEvent={defaultScanEvent}
        exceptionType=""
        actionCompleted={false}
        itemResult={null}
        printAPI={defaultAsyncState}
        printLabelAPI={defaultAsyncState}
        printPalletAPI={defaultAsyncState}
        palletInfo={mockPalletInfo}
        sectionsResult={[]}
        selectedPrinter={defaultPrinter}
        selectedSignType="XSmall"
        printQueue={[]}
        locationPrintQueue={[]}
        printingLocationLabels={LocationName.SECTION}
        printingPalletLabel={false}
        selectedAisle={_.cloneDeep(nonemptyLocation)}
        selectedSection={_.cloneDeep(nonemptyLocation)}
        selectedZone={_.cloneDeep(nonemptyLocation)}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        signQty={1}
        setSignQty={jest.fn()}
        isValidQty={invalidQty}
        setIsValidQty={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        useEffectHook={jest.fn()}
        useLayoutHook={jest.fn()}
        printerList={mockPrinterList}
        userConfig={mockUserConfig}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the Print Price Sign Screen when aisle labels', () => {
    const renderer = ShallowRenderer.createRenderer();
    const invalidQty = false;
    renderer.render(
      <PrintPriceSignScreen
        scannedEvent={defaultScanEvent}
        exceptionType=""
        actionCompleted={false}
        itemResult={testItem}
        printAPI={defaultAsyncState}
        printLabelAPI={defaultAsyncState}
        printPalletAPI={defaultAsyncState}
        palletInfo={mockPalletInfo}
        sectionsResult={[]}
        selectedPrinter={defaultPrinter}
        selectedSignType="XSmall"
        printQueue={[]}
        locationPrintQueue={[]}
        printingLocationLabels={LocationName.AISLE}
        printingPalletLabel={false}
        selectedAisle={_.cloneDeep(nonemptyLocation)}
        selectedSection={_.cloneDeep(nonemptyLocation)}
        selectedZone={_.cloneDeep(nonemptyLocation)}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        signQty={1}
        setSignQty={jest.fn()}
        isValidQty={invalidQty}
        setIsValidQty={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        useEffectHook={jest.fn()}
        useLayoutHook={jest.fn()}
        printerList={mockPrinterList}
        userConfig={mockUserConfig}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the Print Price Sign Screen when printing the pallets', () => {
    const renderer = ShallowRenderer.createRenderer();
    const invalidQty = false;
    renderer.render(
      <PrintPriceSignScreen
        scannedEvent={defaultScanEvent}
        exceptionType=""
        actionCompleted={false}
        itemResult={testItem}
        printAPI={defaultAsyncState}
        printLabelAPI={defaultAsyncState}
        printPalletAPI={defaultAsyncState}
        palletInfo={mockPalletInfo}
        sectionsResult={[]}
        selectedPrinter={defaultPrinter}
        selectedSignType="XSmall"
        printQueue={[]}
        locationPrintQueue={[]}
        printingLocationLabels=""
        printingPalletLabel={true}
        selectedAisle={_.cloneDeep(nonemptyLocation)}
        selectedSection={_.cloneDeep(nonemptyLocation)}
        selectedZone={_.cloneDeep(nonemptyLocation)}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        signQty={1}
        setSignQty={jest.fn()}
        isValidQty={invalidQty}
        setIsValidQty={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        useEffectHook={jest.fn()}
        useLayoutHook={jest.fn()}
        printerList={mockPrinterList}
        userConfig={mockUserConfig}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('Tests rendering Price Sign Sizes', () => {
    it(" Renders 'Wine button' for wine items", () => {
      const renderer = ShallowRenderer.createRenderer();
      const wineItem: ItemDetails = mockItemDetails[789];

      renderer.render(
        renderSignSizeButtons(
          defaultPrinter,
          wineItem.categoryNbr,
          'Wine',
          jest.fn()
        )
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Wine button should be disabled for non-wine items', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        renderSignSizeButtons(
          defaultPrinter,
          testItem.categoryNbr,
          'XSmall',
          jest.fn()
        )
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Large button should be disabled for Portable Printers ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const portablePrinter = {
        type: PrinterType.PORTABLE,
        name: 'Mobile printer',
        labelsAvailable: ['price'],
        desc: 'Default',
        id: '456000000000'
      };
      renderer.render(
        renderSignSizeButtons(
          portablePrinter,
          testItem.categoryNbr,
          'XSmall',
          jest.fn()
        )
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests PrintSign copy limit', () => {
    const validCopyAmount = 5;
    const exceedsCopyLimit = 101;
    const belowCopyLimit = 0;
    const minCopyAmount = 1;
    const maxCopyAmount = 100;

    it('ValidateQty should return true for Copy amount(s) between 1 & 100', () => {
      expect(validateQty(validCopyAmount)).toBe(true);
    });
    it('ValidateQty should return true for Minumum amount of Copies (1)', () => {
      expect(validateQty(minCopyAmount)).toBe(true);
    });
    it('ValidateQty should return true for Maximum amount of copies (100)', () => {
      expect(validateQty(maxCopyAmount)).toBe(true);
    });
    it('ValidateQty should return false for Copy amount(s) greater than 100 ', () => {
      expect(validateQty(exceedsCopyLimit)).toBe(false);
    });
    it('ValidateQty should return false for Copy amount(s) less than 1 ', () => {
      expect(validateQty(belowCopyLimit)).toBe(false);
    });
  });

  describe('Tests PrintPriceSign Functions', () => {
    const mockDispatch = jest.fn();
    const mockSetError = jest.fn();
    const mockSetSignQty = jest.fn();
    const printSuccessApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: '',
        status: 200
      }
    };
    const printFailureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Network Error'
    };
    const printApiIsWaiting: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    const mockPrinterListNoLaser: Printer[] = [
      {
        type: 1,
        name: 'Portable Printer',
        desc: 'Default',
        labelsAvailable: ['price'],
        id: '111111111111'
      }
    ];
    const mockSelectedSection: LocationIdName = {
      id: 3,
      name: '1'
    };
    it('Tests PrintSignApiHook', () => {
      printSignApiHook(
        printSuccessApi,
        navigationProp,
        mockSetError,
        mockDispatch,
        true,
        'NSFL'
      );
      expect(navigationProp.goBack).toHaveBeenCalled();

      printSignApiHook(
        printFailureApi,
        navigationProp,
        mockSetError,
        mockDispatch,
        true,
        'NSFL'
      );
      expect(mockSetError).toHaveBeenCalledWith({
        error: true,
        message: strings('PRINT.PRINT_SERVICE_ERROR')
      });

      printSignApiHook(
        printApiIsWaiting,
        navigationProp,
        mockSetError,
        mockDispatch,
        true,
        'NSFL'
      );
      expect(mockSetError).toHaveBeenCalledWith({
        error: false,
        message: ''
      });
    });

    it('Tests PrintLocationApiHook', () => {
      printLocationApiHook(printSuccessApi, navigationProp, mockSetError);
      expect(navigationProp.goBack).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('PRINT.LOCATION_SUCCESS'),
        position: 'bottom',
        visibilityTime: 3000
      });

      printLocationApiHook(printFailureApi, navigationProp, mockSetError);
      expect(mockSetError).toHaveBeenCalledWith({
        error: true,
        message: strings('PRINT.PRINT_SERVICE_ERROR')
      });

      printLocationApiHook(printApiIsWaiting, navigationProp, mockSetError);
      expect(mockSetError).toHaveBeenCalledWith({ error: false, message: '' });
    });

    it('Test PrintPalletApiHook', () => {
      printPalletApiHook(printSuccessApi, navigationProp, mockSetError);
      expect(navigationProp.goBack).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('PRINT.PALLET_SUCCESS'),
        position: 'bottom',
        visibilityTime: 3000
      });

      printPalletApiHook(printFailureApi, navigationProp, mockSetError);
      expect(mockSetError).toHaveBeenCalledWith({
        error: true,
        message: strings('PRINT.PRINT_SERVICE_ERROR')
      });

      printPalletApiHook(printApiIsWaiting, navigationProp, mockSetError);
      expect(mockSetError).toHaveBeenCalledWith({ error: false, message: '' });
    });

    it('Tests setPrinterLayoutHook', () => {
      setPrinterLayoutHook(
        mockPrinterList,
        mockPrinterList[0],
        mockDispatch,
        true,
        ''
      );
      expect(mockDispatch).toBeCalledTimes(1);
      mockDispatch.mockClear();

      setPrinterLayoutHook(
        mockPrinterList,
        mockPrinterList[0],
        mockDispatch,
        false,
        LocationName.AISLE
      );
      expect(mockDispatch).toBeCalledTimes(1);
      mockDispatch.mockClear();

      setPrinterLayoutHook(
        mockPrinterList,
        mockPrinterList[0],
        mockDispatch,
        false,
        ''
      );
      expect(mockDispatch).toBeCalledTimes(1);
      mockDispatch.mockClear();

      setPrinterLayoutHook(
        mockPrinterListNoLaser,
        mockPrinterListNoLaser[0],
        mockDispatch,
        true,
        ''
      );
      expect(mockDispatch).toBeCalledTimes(3);
    });

    it('Tests getPrinter function', () => {
      let printerPaperSize = getPrinter(mockPrinterList[0], 'Small');
      expect(printerPaperSize).toStrictEqual('S');
      // expect(typeof printerPaperSize).toBe(LaserPaper);

      printerPaperSize = getPrinter(mockPrinterListNoLaser[0], 'Small');
      expect(printerPaperSize).toStrictEqual('C');
      // expect(typeof printerPaperSize).toBe(PortablePaper);
    });

    it('Tests aisleSectionExists function', () => {
      const printQueueWithLocationId: PrintQueueItem[] = [
        {
          itemName: 'Test item',
          itemNbr: 123456,
          upcNbr: '123456',
          catgNbr: 2,
          signQty: 1,
          paperSize: 'Small',
          worklistType: 'NSFL',
          locationId: 1
        }
      ];
      let isAisleSection = aisleSectionExists(printQueueWithLocationId, 1);
      expect(isAisleSection).toBe(true);

      isAisleSection = aisleSectionExists(printQueueWithLocationId, 13);
      expect(isAisleSection).toBe(false);
    });

    it('Tests setHandleDecreaseQty function', () => {
      setHandleDecreaseQty(200, mockSetSignQty);
      expect(mockSetSignQty).toHaveBeenCalledWith(100);

      setHandleDecreaseQty(50, mockSetSignQty);
      expect(mockSetSignQty).toHaveBeenCalled();
    });

    it('Tests setHandleIncreaseQty function', () => {
      setHandleIncreaseQty(0, mockSetSignQty);
      expect(mockSetSignQty).toHaveBeenCalledWith(1);

      setHandleIncreaseQty(99, mockSetSignQty);
      expect(mockSetSignQty).toHaveBeenCalled();
    });

    it('Tests isItemSizeExists function', () => {
      expect(isItemSizeExists(mockPrintQueue, 'Small', 123456)).toBe(true);
      expect(isItemSizeExists(mockPrintQueue, 'Large', 456789)).toBe(false);
    });

    it('Tests isErrorRequired function', () => {
      const isErrorRequiredFalse = isErrorRequired({
        error: false,
        message: ''
      });
      const isErrorRequiredTrue = isErrorRequired({
        error: true,
        message: 'test'
      });

      expect(isErrorRequiredFalse).toBeNull();
      expect(isErrorRequiredTrue).toBeTruthy();
    });

    it('Tests handleAddPrintList function', () => {
      const mockGetFullSectionName = jest.fn(
        sectionName => `${strings('LOCATION.SECTION')} TEST1-${sectionName}`
      );
      const sectionLocName = `${strings('LOCATION.AISLE')} TEST1-2`;
      const mockItemDetailsExists: ItemDetails = {
        ...testItem,
        itemNbr: 123456
      };
      handleAddPrintList(
        mockPrintQueue,
        mockLocationPrintQueue,
        'Small',
        mockItemDetailsExists,
        1,
        'C',
        mockSelectedSection,
        false,
        mockSections,
        LocationName.SECTION,
        mockGetFullSectionName,
        sectionLocName,
        navigationProp,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(trackEvent).toHaveBeenCalledWith('print_already_exists_in_queue', {
        itemName: testItem.itemName,
        selectedSignType: 'Small'
      });
      mockDispatch.mockClear();
      // @ts-expect-error Reset trackEvent Call
      trackEvent.mockClear();

      handleAddPrintList(
        mockPrintQueue,
        mockLocationPrintQueue,
        'Small',
        testItem,
        1,
        'C',
        mockSelectedSection,
        false,
        mockSections,
        '',
        mockGetFullSectionName,
        sectionLocName,
        navigationProp,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(trackEvent).toHaveBeenCalledWith(
        'print_add_to_print_queue',
        expect.any(Object)
      );
      mockDispatch.mockClear();
      // @ts-expect-error Reset trackEvent Call
      trackEvent.mockClear();

      handleAddPrintList(
        mockPrintQueue,
        mockLocationPrintQueue,
        'Small',
        testItem,
        1,
        'C',
        mockSelectedSection,
        false,
        mockSections,
        LocationName.AISLE,
        mockGetFullSectionName,
        sectionLocName,
        navigationProp,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(trackEvent).toHaveBeenCalledWith(
        'print_add_to_loc_print_queue',
        expect.any(Object)
      );
      mockDispatch.mockClear();
      // @ts-expect-error Reset trackEvent Call
      trackEvent.mockClear();

      handleAddPrintList(
        mockPrintQueue,
        mockLocationPrintQueue,
        'Small',
        testItem,
        1,
        'C',
        mockSelectedSection,
        false,
        mockSections,
        LocationName.SECTION,
        mockGetFullSectionName,
        sectionLocName,
        navigationProp,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(trackEvent).toHaveBeenCalledWith(
        'print_add_to_loc_print_queue',
        expect.any(Object)
      );
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests checkQuantity function', () => {
      const mockSetIsValidQty = jest.fn();
      checkQuantity(50, mockSetIsValidQty, mockSetSignQty);

      expect(mockSetSignQty).toHaveBeenCalledWith(50);
      expect(mockSetIsValidQty).toHaveBeenCalled();
    });

    it('Tests isValidDispatch function', () => {
      isValidDispatch(mockDispatch, true, 'NSFL');
      expect(mockDispatch).not.toHaveBeenCalled();
      isValidDispatch(mockDispatch, false, 'PO');
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('Tests handlePrint function', () => {
      handlePrint(
        navigationProp,
        routeProp,
        mockDispatch,
        '',
        mockSections,
        5,
        null,
        mockSelectedSection,
        false,
        1,
        123456,
        'Small',
        'C'
      );
      expect(validateSession).toHaveBeenCalled();
    });

    it('Tests handleChangePrinter function', () => {
      handleChangePrinter(navigationProp, routeProp);
      expect(validateSession).toHaveBeenCalled();
    });
    it('Tests PrintPriceSign buttons', () => {
      const portablePrinter: Printer = {
        ...defaultPrinter,
        type: 1
      };
      const mockSetIsValidQty = jest.fn();
      const { getByText } = render(
        <PrintPriceSignScreen
          scannedEvent={defaultScanEvent}
          exceptionType=""
          actionCompleted={false}
          itemResult={null}
          printAPI={defaultAsyncState}
          printLabelAPI={defaultAsyncState}
          printPalletAPI={defaultAsyncState}
          palletInfo={mockPalletInfo}
          sectionsResult={[]}
          selectedPrinter={portablePrinter}
          selectedSignType="XSmall"
          printQueue={[]}
          locationPrintQueue={[]}
          printingLocationLabels={LocationName.SECTION}
          printingPalletLabel={true}
          selectedAisle={_.cloneDeep(nonemptyLocation)}
          selectedSection={_.cloneDeep(nonemptyLocation)}
          selectedZone={_.cloneDeep(nonemptyLocation)}
          dispatch={mockDispatch}
          navigation={navigationProp}
          route={routeProp}
          signQty={1}
          setSignQty={jest.fn()}
          isValidQty={true}
          setIsValidQty={mockSetIsValidQty}
          error={defaultError}
          setError={jest.fn()}
          useEffectHook={jest.fn()}
          useLayoutHook={jest.fn()}
          printerList={mockPrinterList}
          userConfig={mockUserConfig}
        />
      );
      const addPrintQueueButton = getByText(strings('PRINT.ADD_TO_QUEUE'));
      const addPrintButton = getByText(strings('PRINT.PRINT'));

      mockDispatch.mockClear();
      fireEvent.press(addPrintQueueButton);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(trackEvent).toHaveBeenCalled();

      fireEvent.press(addPrintButton);
      expect(validateSession).toHaveBeenCalled();
    });

    it('Tests selectQuantityView buttons', () => {
      const mockSetIsValidQty = jest.fn();
      const { getByTestId } = render(
        selectQuantityView(mockSetIsValidQty, 50, mockSetSignQty, true)
      );

      const minusButton = getByTestId('minusbutton');
      const plusButton = getByTestId('plusbutton');
      const signQtyInput = getByTestId('signQtyInput');
      fireEvent.press(minusButton);
      expect(mockSetIsValidQty).toBeCalledTimes(1);

      fireEvent.press(plusButton);
      expect(mockSetIsValidQty).toBeCalledTimes(2);

      fireEvent.changeText(signQtyInput, '55');
      expect(mockSetSignQty).toBeCalledWith(55);
    });

    it('Tests navListenerHook', () => {
      navigationProp.addListener = jest.fn().mockImplementation((event, callBack) => {
        callBack();
      });

      navListenerHook(navigationProp, mockDispatch, LocationName.SECTION, true);
      expect(navigationProp.addListener).toBeCalledWith('beforeRemove', expect.any(Function));
      expect(navigationProp.addListener).toBeCalledWith('focus', expect.any(Function));
      expect(mockDispatch).toBeCalledTimes(7);
    });
  });
});
