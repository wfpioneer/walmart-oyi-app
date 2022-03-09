import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AssignLocationScreen } from './AssignLocation';
import { BinningPallet } from '../../models/Binning';
import { mockPallets } from '../../mockData/binning';

describe('Assign Location screen render tests', () => {
  it('renders screen with no items', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: BinningPallet[] = [];
    renderer.render(<AssignLocationScreen palletsToBin={testPallets} isManualScanEnabled={false} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with items', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<AssignLocationScreen palletsToBin={mockPallets} isManualScanEnabled={false} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with manual scan enabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: BinningPallet[] = [];
    renderer.render(<AssignLocationScreen palletsToBin={testPallets} isManualScanEnabled={true} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
