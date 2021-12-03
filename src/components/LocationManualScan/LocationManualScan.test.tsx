import React from 'react';
import { TextInput } from 'react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationManualScanComponent, onSubmit } from './LocationManualScan';

let textInputProp: React.RefObject<TextInput>;
jest.mock('../../utils/scannerUtils.ts', () => ({
  manualScan: () => {}
}));

describe('Test Location Manual Scan Component', () => {
  it('Renders Manual Scan component with a Valid Section Name', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManualScanComponent
        dispatch={jest.fn()}
        onChangeText={jest.fn()}
        value="ABCD1-2"
        textInputRef={textInputProp}
        keyboardType="default"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders Manual Scan component with a Valid Section ID ', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManualScanComponent
        dispatch={jest.fn()}
        onChangeText={jest.fn()}
        value="12345"
        textInputRef={textInputProp}
        keyboardType="default"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Error message with Invalid Location Name', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManualScanComponent
        dispatch={jest.fn()}
        onChangeText={jest.fn()}
        value="Not a Location"
        textInputRef={textInputProp}
        keyboardType="default"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  describe('Tests onSubmit Function', () => {
    it('Calls Dispatch Function if a valid location name is entered', async () => {
      const dispatch = jest.fn();
      onSubmit('ABCD1-2', dispatch);
      expect(dispatch).toHaveBeenCalled();
    });

    it('Does not Call Dispatch if an in-valid location name is entered', async () => {
      const dispatch = jest.fn();
      onSubmit('Not a Location', dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
