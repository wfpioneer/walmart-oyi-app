import React from 'react';
import { TextInput } from 'react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationManualScanComponent } from './LocationManualScan';

let textInputProp: React.RefObject<TextInput>;
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
});
