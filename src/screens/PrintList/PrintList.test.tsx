import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  NoPrintQueueMessage, PrintListsScreen, handleChangePrinter, locationLabelsApiEffect, printItemApiEffect
} from './PrintList';
import { Printer, PrinterType } from '../../models/Printer';
import { mockLargePrintQueue, mockPrintQueue } from '../../mockData/mockPrintQueue';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';

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
let routeProp: RouteProp<any, string>;
describe('PrintListScreen', () => {
  const renderer = ShallowRenderer.createRenderer();
  const defaultPrinter: Printer = {
    type: PrinterType.LASER,
    name: 'Front desk printer',
    desc: 'Default',
    id: '123000000000',
    labelsAvailable: ['price']
  };
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  describe('Test rendering items in the PrintListScreen', () => {
    it('Renders the default empty PrintListScreen', () => {
      renderer.render(
        <PrintListsScreen
          selectedPrinter={defaultPrinter}
          printQueue={[]}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          tabName="PRICESIGN"
          useEffectHook={jest.fn()}
          printAPI={defaultAsyncState}
          printLocationAPI={defaultAsyncState}
          printingLocationLabels=""
          itemIndexToEdit={-1}
          setItemIndexToEdit={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the PrintListScreen with a single item', () => {
      renderer.render(
        <PrintListsScreen
          selectedPrinter={defaultPrinter}
          printQueue={mockPrintQueue}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          tabName="PRICESIGN"
          useEffectHook={jest.fn()}
          printAPI={defaultAsyncState}
          printLocationAPI={defaultAsyncState}
          printingLocationLabels=""
          itemIndexToEdit={-1}
          setItemIndexToEdit={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the PrintListScreen with multiple items', () => {
      renderer.render(
        <PrintListsScreen
          selectedPrinter={defaultPrinter}
          printQueue={mockLargePrintQueue}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          tabName="PRICESIGN"
          useEffectHook={jest.fn()}
          printAPI={defaultAsyncState}
          printLocationAPI={defaultAsyncState}
          printingLocationLabels=""
          itemIndexToEdit={-1}
          setItemIndexToEdit={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the PrintListScreen with the PrintQueueEdit Modal as visible', () => {
      const singleItemToEdit = 0;
      renderer.render(
        <PrintListsScreen
          selectedPrinter={defaultPrinter}
          printQueue={mockPrintQueue}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          tabName="PRICESIGN"
          useEffectHook={jest.fn()}
          printAPI={defaultAsyncState}
          printLocationAPI={defaultAsyncState}
          printingLocationLabels=""
          itemIndexToEdit={singleItemToEdit}
          setItemIndexToEdit={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the NoPrintQueueMessage component', () => {
      renderer.render(
        <NoPrintQueueMessage />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering printing api responses', () => {
    const printApiIsWaiting = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    it('Renders the loading indicator when waiting for the printAPI response', () => {
      renderer.render(
        <PrintListsScreen
          selectedPrinter={defaultPrinter}
          printQueue={mockPrintQueue}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          tabName="PRICESIGN"
          useEffectHook={jest.fn()}
          printAPI={printApiIsWaiting}
          printLocationAPI={defaultAsyncState}
          printingLocationLabels=""
          itemIndexToEdit={-1}
          setItemIndexToEdit={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the loading indicator when waiting for the printLocationAPI response', () => {
      renderer.render(
        <PrintListsScreen
          selectedPrinter={defaultPrinter}
          printQueue={mockPrintQueue}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          tabName="PRICESIGN"
          useEffectHook={jest.fn()}
          printAPI={defaultAsyncState}
          printLocationAPI={printApiIsWaiting}
          printingLocationLabels=""
          itemIndexToEdit={-1}
          setItemIndexToEdit={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('PrintListScreen externalized function tests', () => {
    const mockDispatch = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Tests printAPIHook on success', () => {
      const printApiSuccess: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 200
        }
      };
      const successToast = {
        type: 'success',
        text1: strings('PRINT.PRICE_SIGN_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      printItemApiEffect(printApiSuccess, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining(successToast));
    });

    it('Tests printAPIHook on partial success', () => {
      const partialSuccess: AsyncState = {
        ...defaultAsyncState,
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
            },
            {
              itemNbr: null,
              upcNbr: 5432178439,
              completed: true
            }
          ],
          status: 207
        }
      };
      const partialSuccessPrint = {
        type: 'info',
        text1: strings('PRINT.SOME_PRINTS_FAILED'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      printItemApiEffect(partialSuccess, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining(partialSuccessPrint));
    });
    it('Tests printAPIHook on error', () => {
      const printApiError: AsyncState = {
        ...defaultAsyncState,
        error: 'timeout'
      };
      const printError = {
        type: 'error',
        text1: strings('PRINT.PRINT_SERVICE_ERROR'),
        visibilityTime: 4000,
        position: 'bottom'
      };

      printItemApiEffect(printApiError, mockDispatch, navigationProp);
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining(printError));
    });

    it('Tests printLocationAPIHook on success', () => {
      const printApiSuccess: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 200
        }
      };
      const successToast = {
        type: 'success',
        text1: strings('PRINT.LOCATION_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      locationLabelsApiEffect(printApiSuccess, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining(successToast));
    });

    it('Tests printLocationAPIHook on error', () => {
      const printApiError: AsyncState = {
        ...defaultAsyncState,
        error: 'timeout'
      };
      const printError = {
        type: 'error',
        text1: strings('PRINT.PRINT_SERVICE_ERROR'),
        visibilityTime: 4000,
        position: 'bottom'
      };

      locationLabelsApiEffect(printApiError, mockDispatch, navigationProp);
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining(printError));
    });

    it('Tests handleChangePrinter function on Location Tab', () => {
      const newRouteProp: RouteProp<any, string> = { key: '', name: 'PrintList' };
      handleChangePrinter('LOCATION', navigationProp, newRouteProp, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: 'Location',
        type: 'PRINT/SET_PRINTING_TYPE'
      });
    });

    it('Tests handleChangePrinter function on Price Sign Tab', () => {
      const newRouteProp: RouteProp<any, string> = { key: '', name: 'PrintList' };
      handleChangePrinter('PRICESIGN', navigationProp, newRouteProp, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: 'Price Sign',
        type: 'PRINT/SET_PRINTING_TYPE'
      });
    });
  });
});
