import { NavigationProp, Route } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../locales';
import { PrintQueueItem, PrinterType } from '../../models/Printer';
import { PrintQueueScreen, handlePrint, renderPrintItem, printItemApiEffect } from './PrintQueue';

// Something gets into a weird state, and this seems to fix it
jest.useFakeTimers();
jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;

describe('PrintQueueScreen', () => {
  const defaultPrinter = {
    type: PrinterType.LASER,
    name: 'Front Desk Printer',
    desc: 'Default',
    id: '000000000000'
  };
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const defaultError = {
    error: false,
    message: ''
  };
  const mockPrintQueue: PrintQueueItem[] = [{
    itemName: 'Test item',
    itemNbr: 123456,
    upcNbr: '123456',
    catgNbr: 2,
    signQty: 1,
    paperSize: 'Small',
    worklistType: 'NSFL'
  }];
  describe('Test rendering items in printQueue', () => {
    it('Renders Empty Print list for Zero Items in queue', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<PrintQueueScreen
        printQueue={[]}
        selectedPrinter={defaultPrinter}
        printAPI={defaultAsyncState}
        printLabelAPI={defaultAsyncState}
        printingLocationLabels=""
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        itemIndexToEdit={-1}
        setItemIndexToEdit={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        trackEventCall={jest.fn()}
        validateSessionCall={jest.fn(() => Promise.resolve())}
        useEffectHook={jest.fn()}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the print queue with 10 items in it', () => {
      const renderer = ShallowRenderer.createRenderer();
      const largePrintQueue: PrintQueueItem[] = [{
        itemName: 'Test item',
        itemNbr: 123456,
        upcNbr: '123456',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'XSmall',
        worklistType: 'NSFL'
      }, {
        itemName: 'Test item',
        itemNbr: 123456,
        upcNbr: '123456',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Small',
        worklistType: 'NSFL'
      }, {
        itemName: 'Test item',
        itemNbr: 123456,
        upcNbr: '123456',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Medium',
        worklistType: 'NSFL'
      }, {
        itemName: 'Test item',
        itemNbr: 123456,
        upcNbr: '123456',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Large',
        worklistType: 'NSFL'
      }, {
        itemName: 'Test item',
        itemNbr: 123456,
        upcNbr: '123456',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Wine',
        worklistType: 'NSFL'
      }, {
        itemName: 'Store Use Item',
        itemNbr: 789012,
        upcNbr: '789012',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'XSmall',
        worklistType: 'NSFL'
      }, {
        itemName: 'Store Use Item',
        itemNbr: 789012,
        upcNbr: '789012',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Small',
        worklistType: 'NSFL'
      }, {
        itemName: 'Store Use Item',
        itemNbr: 789012,
        upcNbr: '789012',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Medium',
        worklistType: 'NSFL'
      }, {
        itemName: 'Store Use Item',
        itemNbr: 789012,
        upcNbr: '789012',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Large',
        worklistType: 'NSFL'
      }, {
        itemName: 'Store Use Item',
        itemNbr: 789012,
        upcNbr: '789012',
        catgNbr: 2,
        signQty: 1,
        paperSize: 'Wine',
        worklistType: 'NSFL'
      }];
      renderer.render(<PrintQueueScreen
        printQueue={largePrintQueue}
        selectedPrinter={defaultPrinter}
        printAPI={defaultAsyncState}
        printLabelAPI={defaultAsyncState}
        printingLocationLabels=""
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        itemIndexToEdit={-1}
        setItemIndexToEdit={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        trackEventCall={jest.fn()}
        validateSessionCall={jest.fn(() => Promise.resolve())}
        useEffectHook={jest.fn()}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders a single item for renderPrintItem', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPrintItem(mockPrintQueue, jest.fn(), jest.fn(), navigationProp, routeProp, jest.fn(), jest.fn())[0]
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Edit PrintQueue Modal should be visible', () => {
      const renderer = ShallowRenderer.createRenderer();
      const singleItemToEdit = 0;
      renderer.render(<PrintQueueScreen
        printQueue={mockPrintQueue}
        selectedPrinter={defaultPrinter}
        printAPI={defaultAsyncState}
        printLabelAPI={defaultAsyncState}
        printingLocationLabels=""
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        itemIndexToEdit={singleItemToEdit}
        setItemIndexToEdit={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        trackEventCall={jest.fn()}
        validateSessionCall={jest.fn(() => Promise.resolve())}
        useEffectHook={jest.fn()}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering printQueue api response', () => {
    it('Renders Print service error ', () => {
      const printError = {
        error: true,
        message: strings('PRINT.PRINT_SERVICE_ERROR')
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<PrintQueueScreen
        printQueue={mockPrintQueue}
        selectedPrinter={defaultPrinter}
        printAPI={defaultAsyncState}
        printLabelAPI={defaultAsyncState}
        printingLocationLabels=""
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        itemIndexToEdit={-1}
        setItemIndexToEdit={jest.fn()}
        error={printError}
        setError={jest.fn()}
        trackEventCall={jest.fn()}
        validateSessionCall={jest.fn(() => Promise.resolve())}
        useEffectHook={jest.fn()}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders loader waiting for printApi response ', () => {
      const printApiIsWaiting = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<PrintQueueScreen
        printQueue={mockPrintQueue}
        selectedPrinter={defaultPrinter}
        printAPI={printApiIsWaiting}
        dispatch={jest.fn()}
        printLabelAPI={defaultAsyncState}
        printingLocationLabels=""
        navigation={navigationProp}
        route={routeProp}
        itemIndexToEdit={-1}
        setItemIndexToEdit={jest.fn()}
        error={defaultError}
        setError={jest.fn()}
        trackEventCall={jest.fn()}
        validateSessionCall={jest.fn(() => Promise.resolve())}
        useEffectHook={jest.fn()}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Print Queue externalized function tests', () => {
    it('calls handlePrint dispatch ', async () => {
      const dispatch = jest.fn();
      await handlePrint({
        validateSessionCall: jest.fn(() => Promise.resolve()),
        dispatch,
        navigation: navigationProp,
        printQueue: [],
        route: { key: '', name: 'TEST' },
        selectedPrinter: defaultPrinter,
        printingLocationLabels: ''
      });

      expect(dispatch).toHaveBeenCalled();
    });
    it('calls handlePrint validateSession', async () => {
      const validateSessionCall = jest.fn(() => Promise.resolve());
      await handlePrint({
        validateSessionCall,
        dispatch: jest.fn(),
        navigation: navigationProp,
        printQueue: [],
        route: { key: '', name: 'TEST' },
        selectedPrinter: defaultPrinter,
        printingLocationLabels: ''
      });

      expect(validateSessionCall).toHaveBeenCalled();
    });
  });

  it('ensures that print API works on 200 success', () => {
    const mockDispatch = jest.fn();
    const printAPI = {
      value: {},
      isWaiting: false,
      result: {
        data: [
          {
            itemNbr: 252465123,
            upcNbr: null,
            completed: true
          },
          {
            itemNbr: 250061,
            upcNbr: null,
            completed: true
          }
        ],
        status: 200
      },
      error: null
    };
    const mockSetError = jest.fn();

    const mockGoBack = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = { goBack: mockGoBack };
    printItemApiEffect(printAPI, mockDispatch, navigationProp, mockSetError);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(1);
    expect(mockSetError).toBeCalledTimes(0);
  });

  it('ensures that print API works on 207 success', () => {
    const mockDispatch = jest.fn();
    const printAPI = {
      value: {},
      isWaiting: false,
      result: {
        data: [
          {
            itemNbr: 252465123,
            upcNbr: null,
            completed: false
          },
          {
            itemNbr: 250061,
            upcNbr: null,
            completed: true
          }
        ],
        status: 207
      },
      error: null
    };
    const mockSetError = jest.fn();

    const mockGoBack = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = { goBack: mockGoBack };
    printItemApiEffect(printAPI, mockDispatch, navigationProp, mockSetError);
    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockGoBack).toBeCalledTimes(0);
    expect(mockSetError).toBeCalledTimes(0);
  });

  it('ensures that print API works on fail', () => {
    const mockDispatch = jest.fn();
    const printAPI = {
      value: {},
      isWaiting: false,
      result: null,
      error: 'timeout'
    };
    const mockSetError = jest.fn();

    const mockGoBack = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigationProp = { goBack: mockGoBack };
    printItemApiEffect(printAPI, mockDispatch, navigationProp, mockSetError);
    expect(mockDispatch).toBeCalledTimes(0);
    expect(mockGoBack).toBeCalledTimes(0);
    expect(mockSetError).toBeCalledTimes(1);
  });
});
