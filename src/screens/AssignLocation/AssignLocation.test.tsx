import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PalletInfo } from '../../models/PalletManagementTypes';
import { AssignLocationScreen } from './AssignLocation';

describe('Assign Location screen render tests', () => {
  it('renders screen with no items', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: PalletInfo[] = [];

    renderer.render(<AssignLocationScreen palletsToBin={testPallets} />);

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

    renderer.render(<AssignLocationScreen palletsToBin={testPallets} />);

    // TODO update snapshot after pallet card is added
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
