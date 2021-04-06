import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ChangePrinterScreen } from './ChangePrinter';

let navigationProp: NavigationProp<any>;
describe('ChangePrinterScreen', () => {
  const renderer = ShallowRenderer.createRenderer();
  const invalidMacAddress = '123456';
  const validMacAddress = '777888999000';

  it('Renders Error for Printer MacAddress not equal to 12 characters', () => {
    renderer.render(
      <ChangePrinterScreen
        macAddress={invalidMacAddress}
        updateMacAddress={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
