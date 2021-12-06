import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Printer, PrinterType } from '../../../models/Printer';
import { ChangePrinterScreen } from './ChangePrinter';

let navigationProp: NavigationProp<any>;
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
  it('Renders Error for Printer MacAddress not equal to 12 characters', () => {
    renderer.render(
      <ChangePrinterScreen
        macAddress={invalidMacAddress}
        updateMacAddress={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        printers={jest.fn()}
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
        printers={jest.fn()}
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
