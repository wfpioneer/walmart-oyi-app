import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import ListGroup, { CollapsibleCard } from './ListGroup';
import { mockPickLists } from '../../mockData/mockPickList';
import { PickListItem, PickStatus, Tabs } from '../../models/Picking.d';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native') as any,
  useNavigation: () => jest.fn
}));

describe('ListGroup', () => {
  describe('Tests rendering the ListGroup component', () => {
    it('Test renders the ListGroup component with groupItems prop as false', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ListGroup
          groupItems={false}
          pickListItems={mockPickLists}
          title="ABAR-2"
          currentTab={Tabs.PICK}
          dispatch={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the ListGroup component with groupItems prop as true', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickLists: PickListItem[] = [
        ...mockPickLists,
        {
          assignedAssociate: 'Associate 2',
          category: 46,
          createTs: '2022-04-03T12:55:31.9633333Z',
          createdBy: 'Associate 2',
          id: 4,
          itemDesc: 'Candy',
          itemNbr: 7344,
          moveToFront: true,
          palletId: '4321',
          palletLocationId: 1672,
          palletLocationName: 'C1-2-1',
          quickPick: false,
          salesFloorLocationId: 1673,
          salesFloorLocationName: 'C1-3',
          status: PickStatus.ACCEPTED_PICK,
          upcNbr: '000041800004'
        }
      ];
      renderer.render(
        <ListGroup
          groupItems={true}
          pickListItems={newMockPickLists}
          title="ABAR-2"
          currentTab={Tabs.PICK}
          dispatch={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the ListGroup component with groupItems and multiBinEnabled as true', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickLists: PickListItem[] = [
        ...mockPickLists,
        {
          assignedAssociate: '',
          category: 46,
          createTs: '2022-04-03T12:55:31.9633333Z',
          createdBy: 'Associate 2',
          id: 4,
          itemDesc: 'Candy',
          itemNbr: 7344,
          moveToFront: true,
          palletId: '4321',
          palletLocationId: 1672,
          palletLocationName: 'C1-2-1',
          quickPick: false,
          salesFloorLocationId: 1673,
          salesFloorLocationName: 'C1-3',
          status: PickStatus.READY_TO_BIN,
          upcNbr: '000041800004'
        }
      ];
      renderer.render(
        <ListGroup
          groupItems={true}
          pickListItems={newMockPickLists}
          title="ABAR-2"
          currentTab={Tabs.PICK}
          dispatch={jest.fn()}
          multiBinEnabled={true}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the ListGroup component with groupItems and multiPickEnabled as true', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickLists: PickListItem[] = [
        ...mockPickLists,
        {
          assignedAssociate: '',
          category: 46,
          createTs: '2022-04-03T12:55:31.9633333Z',
          createdBy: 'Associate 2',
          id: 4,
          itemDesc: 'Candy',
          itemNbr: 7344,
          moveToFront: true,
          palletId: '4321',
          palletLocationId: 1672,
          palletLocationName: 'C1-2-1',
          quickPick: false,
          salesFloorLocationId: 1673,
          salesFloorLocationName: 'C1-3',
          status: PickStatus.READY_TO_PICK,
          upcNbr: '000041800004'
        }
      ];
      renderer.render(
        <ListGroup
          groupItems={true}
          pickListItems={newMockPickLists}
          title="ABAR-2"
          currentTab={Tabs.PICK}
          dispatch={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests CollapsibleCard Component', () => {
    it('should tests CollapsibleCard when the card is opened', async () => {
      const { toJSON } = render(
        <CollapsibleCard
          toggleIsOpened={jest.fn}
          isOpened={true}
          title="ABAR-1"
          showCheckbox={false}
          pickListWithStatusReady={[]}
          dispatch={jest.fn()}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('should tests CollapsibleCard when the card is closed', async () => {
      const { toJSON } = render(
        <CollapsibleCard
          toggleIsOpened={jest.fn}
          isOpened={false}
          title="ABAR-1"
          showCheckbox={false}
          pickListWithStatusReady={[]}
          dispatch={jest.fn()}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('should test CollapsibleCard onPress', async () => {
      const mockToggleOpen = jest.fn();
      const { findByTestId } = render(
        <CollapsibleCard
          toggleIsOpened={mockToggleOpen}
          isOpened={false}
          title="ABAR-1"
          showCheckbox={false}
          pickListWithStatusReady={[]}
          dispatch={jest.fn()}
        />
      );
      const collapsibleCard = await findByTestId('collapsible-card');
      fireEvent.press(collapsibleCard);
      expect(mockToggleOpen).toHaveBeenCalledTimes(1);
      expect(mockToggleOpen).toHaveBeenCalledWith(true);
    });
    it('should test title of the card', () => {
      const { findByText } = render(
        <CollapsibleCard
          toggleIsOpened={jest.fn}
          isOpened={false}
          title="ABAR-1"
          showCheckbox={false}
          pickListWithStatusReady={[]}
          dispatch={jest.fn()}
        />
      );
      expect(findByText('ABAR-1')).toBeTruthy();
    });
    it('should tests CollapsibleCard with showCheckbox is true', async () => {
      const mockDispatch = jest.fn();
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<CollapsibleCard
        toggleIsOpened={jest.fn}
        isOpened={false}
        title="ABAR-1"
        showCheckbox={true}
        pickListWithStatusReady={[{ ...mockPickLists[0], status: PickStatus.READY_TO_BIN }]}
        dispatch={mockDispatch}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
