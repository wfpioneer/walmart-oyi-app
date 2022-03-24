import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { strings } from '../../locales';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import PickItemInfo, { deleteView } from './PickItemInfoCard';

describe('Tests rendering PickItemInfoCard', () => {
  const mockPickListItem: PickListItem = {
    assignedAssociate: 'me',
    category: 71,
    createTS: '10:32 AM 02/04/2022',
    createdBy: 'someone else',
    id: 418,
    itemDesc: 'Teapot',
    itemNbr: 734,
    moveToFront: true,
    palletId: 4321,
    palletLocation: 'C1-2',
    quickPick: false,
    salesFloorLocation: 'C1-3',
    status: PickStatus.ACCEPTED_PICK,
    upcNbr: '000041800003'
  };
  it('Renders the pickItemInfoCard', () => {
    const { toJSON, getByText } = render(
      <PickItemInfo
        pickListItem={mockPickListItem}
        canDelete={true}
        onDeletePressed={jest.fn()}
      />
    );
    const swipeGesture = getByText(mockPickListItem.itemDesc);
    fireEvent(swipeGesture, 'swipeableRightOpen');
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the deleteView component and fires the Delete button', () => {
    const mockDeleteButton = jest.fn();
    const { toJSON, getByText } = render(deleteView(mockDeleteButton));
    const fireDeleteItem = getByText(strings('GENERICS.DELETE'));
    fireEvent.press(fireDeleteItem);
    expect(mockDeleteButton).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });
});
