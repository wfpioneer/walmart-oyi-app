import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Printer, PrinterType } from '../../../models/Printer';
import { ChangePrinterScreen, isPrinterExists, submitMacAddress } from './ChangePrinter';

jest.mock('../../../utils/asyncStorageUtils', () => {
  const asycnUtils = jest.requireActual('../../../utils/asyncStorageUtils');
  return {
    ...asycnUtils,
    savePrinter: jest.fn()
  };
});
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
describe('ChangePrinterScreen', () => {
  const renderer = ShallowRenderer.createRenderer();
  const invalidMacAddress = '123456';
  const validMacAddress = '777888999000';
  const duplicatePrinter: Printer[] = [{
    type: PrinterType.LASER, name: '', desc: '', id: '777888999000'
  }, {
    type: PrinterType.LASER, name: '', desc: '', id: '777888999000'
  }];
  const noDuplicatePrinter: Printer[] = [{
    type: PrinterType.LASER, name: '', desc: '', id: '777888999000'
  }, {
    type: PrinterType.LASER, name: '', desc: '', id: '777888999001'
  }];
  describe('Tests ChangePrinterScreen ', () => {
    it('Renders Error for Printer MacAddress not equal to 12 characters', () => {
      renderer.render(
        <ChangePrinterScreen
          macAddress={invalidMacAddress}
          updateMacAddress={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          printers={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Enabled Submit button for MacAddress equal to 12 characters', () => {
      renderer.render(
        <ChangePrinterScreen
          macAddress={validMacAddress}
          updateMacAddress={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          printers={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders error if duplicate printers exist', () => {
      renderer.render(
        <ChangePrinterScreen
          macAddress={invalidMacAddress}
          updateMacAddress={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          printers={duplicatePrinter}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders enabled submit button if no duplicate printers exist', () => {
      renderer.render(
        <ChangePrinterScreen
          macAddress={invalidMacAddress}
          updateMacAddress={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          printers={noDuplicatePrinter}

        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests submitMacAddress function', () => {
    const mockDispatch = jest.fn();
    const mockTrackEvent = jest.fn();
    const asyncPrinter = jest.requireMock('../../../utils/asyncStorageUtils');

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('submitMacAddress calls zero functions if macAddress length is less than 12', () => {
      submitMacAddress(
        invalidMacAddress,
        mockTrackEvent,
        mockDispatch,
        navigationProp,
      );
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockTrackEvent).not.toHaveBeenCalled();
      expect(asyncPrinter.savePrinter).not.toHaveBeenCalled();
    });
    it('submitMacAddress calls savePrinter dispatch functions if the macAddress length is 12', () => {
      submitMacAddress(
        validMacAddress,
        mockTrackEvent,
        mockDispatch,
        navigationProp,
      );
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockTrackEvent).toHaveBeenCalledTimes(1);
      expect(asyncPrinter.savePrinter).toHaveBeenCalled();
      expect(navigationProp.goBack).toHaveBeenCalled();
    });
  });

  describe('Tests isPrinterExists function', () => {
    it('isPrinterExists returns false if the printerList has zero printers', () => {
      expect(isPrinterExists([], validMacAddress)).toBeFalsy();
    });
    it('isPrinterExists returns false if the printerList has no matching macAddress', () => {
      expect(isPrinterExists(noDuplicatePrinter, invalidMacAddress)).toBeFalsy();
    });
    it('isPrinterExists returns true if the printerList has printers with at least one matching macAddress', () => {
      expect(isPrinterExists(noDuplicatePrinter, validMacAddress)).toBeTruthy();
    });
  });
});
