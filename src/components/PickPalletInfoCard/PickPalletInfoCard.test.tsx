import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import PickPalletInfoCard from './PickPalletInfoCard';

describe('Pick pallet info card render tests', () => {
  const mockPickListItems: PickListItem[] = [
    {
      assignedAssociate: 'me',
      category: 71,
      createTS: 'just now',
      createdBy: 'you',
      id: 2,
      itemDesc: 'Lucas gusano',
      itemNbr: 54321,
      moveToFront: true,
      palletId: 3,
      palletLocation: 'ABAR1-1',
      quickPick: true,
      salesFloorLocation: 'ABAR1-2',
      status: PickStatus.ACCEPTED_BIN,
      upcNbr: '725181009016'
    },
    {
      assignedAssociate: 'you',
      category: 34,
      createTS: 'yesterday',
      createdBy: 'why',
      id: 5,
      itemDesc: 'Duvalín Bi Sabor',
      itemNbr: 12345,
      moveToFront: true,
      palletId: 4,
      palletLocation: 'ABAR1-2',
      quickPick: false,
      salesFloorLocation: 'ABAR1-1',
      status: PickStatus.ACCEPTED_PICK,
      upcNbr: '02520568'
    }
  ];
  it('renders the card for each picking type', () => {
    const renderer = ShallowRenderer.createRenderer();

    Object.values(PickStatus).forEach(status => {
      renderer.render(
        <PickPalletInfoCard
          onPress={jest.fn()}
          palletId={2}
          palletLocation="ABAR1-1"
          pickListItems={[]}
          pickStatus={status}
        />
      );

      expect(renderer.getRenderOutput()).toMatchSnapshot(`Pick status - ${status}`);
    });
  });

  it('renders the card with items (some filtered)', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <PickPalletInfoCard
        onPress={jest.fn()}
        palletId={2}
        palletLocation="ABAR1-1"
        pickListItems={mockPickListItems}
        pickStatus={PickStatus.READY_TO_PICK}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('tests pressing the pallet card', () => {
    const mockPressPallet = jest.fn();
    const { getByTestId } = render(
      <PickPalletInfoCard
        onPress={mockPressPallet}
        palletId={3}
        palletLocation="ABAR1-1"
        pickListItems={[]}
        pickStatus={PickStatus.COMPLETE}
      />
    );

    const button = getByTestId('palletPress');
    fireEvent.press(button);

    expect(mockPressPallet).toBeCalledTimes(1);
  });
});
