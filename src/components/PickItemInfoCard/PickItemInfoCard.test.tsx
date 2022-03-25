import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { strings } from '../../locales';
import { mockPickLists } from '../../mockData/mockPickList';
import PickItemInfo, { deleteView } from './PickItemInfoCard';

describe('Tests rendering PickItemInfoCard', () => {
  it('Renders the pickItemInfoCard', () => {
    const { toJSON, getByText } = render(
      <PickItemInfo
        pickListItem={mockPickLists[0]}
        canDelete={true}
        onDeletePressed={jest.fn()}
      />
    );
    const swipeGesture = getByText(mockPickLists[0].itemDesc);
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
