import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PalletInfo } from '../../models/PalletManagementTypes';
import { AssignLocationScreen } from './AssignLocation';

describe('Assign Location screen render tests', () => {
  it('renders screen with no items', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: PalletInfo[] = [];

    renderer.render(<AssignLocationScreen palletsToBin={testPallets} isManualScanEnabled={false} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with items', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: PalletInfo[] = [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      }
    ];

    renderer.render(<AssignLocationScreen palletsToBin={testPallets} isManualScanEnabled={false} />);

    // TODO update snapshot after pallet card is added
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with manual scan enabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: PalletInfo[] = [];

    renderer.render(<AssignLocationScreen palletsToBin={testPallets} isManualScanEnabled={true} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  })
});
