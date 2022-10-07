import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { SalesFloorTabScreen } from './SalesFloorTabScreen';

describe('SalesFloorTabScreen', () => {
  it('Renders the SalesFloorTabScreen Component', () => {
    const renderer = ShallowRenderer.createRenderer();
    const salesPickList: PickListItem[] = [
      {
        assignedAssociate: 'Associate 3',
        category: 72,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 5,
        itemDesc: 'Tea',
        itemNbr: 846,
        moveToFront: true,
        palletId: '5432',
        palletLocationId: 2345,
        palletLocationName: 'BREW1-2',
        quickPick: false,
        salesFloorLocationId: 2345,
        salesFloorLocationName: 'BREW1-2',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      },
      {
        assignedAssociate: 'Associate 4',
        category: 78,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 6,
        itemDesc: 'Steak',
        itemNbr: 847,
        moveToFront: false,
        palletId: '5433',
        palletLocationId: 2344,
        palletLocationName: 'ABAR1-1',
        quickPick: false,
        salesFloorLocationId: 2344,
        salesFloorLocationName: 'ABAR1-1',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      },
      {
        assignedAssociate: 'Associate 4',
        category: 78,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 7,
        itemDesc: 'Chicken',
        itemNbr: 848,
        moveToFront: false,
        palletId: '5433',
        palletLocationId: 2344,
        palletLocationName: 'ABAR1-2',
        quickPick: false,
        salesFloorLocationId: 2344,
        salesFloorLocationName: 'ABAR1-2',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      },
      {
        assignedAssociate: 'Associate 3',
        category: 72,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 8,
        itemDesc: 'Juice',
        itemNbr: 846,
        moveToFront: false,
        palletId: '5432',
        palletLocationId: 2345,
        palletLocationName: 'BREW1-2',
        quickPick: false,
        salesFloorLocationId: 2345,
        salesFloorLocationName: 'BREW1-2',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      }
    ];
    renderer.render(
      <SalesFloorTabScreen
        readyToWorklist={salesPickList}
        dispatch={jest.fn()}
        refreshing={false}
        onRefresh={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the SalesFloorTabScreen Component while refreshing', () => {
    const renderer = ShallowRenderer.createRenderer();
    const salesPickList: PickListItem[] = [
      {
        assignedAssociate: 'Associate 3',
        category: 72,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 5,
        itemDesc: 'Tea',
        itemNbr: 846,
        moveToFront: true,
        palletId: '5432',
        palletLocationId: 2345,
        palletLocationName: 'BREW1-2',
        quickPick: false,
        salesFloorLocationId: 2345,
        salesFloorLocationName: 'BREW1-2',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      },
      {
        assignedAssociate: 'Associate 4',
        category: 78,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 6,
        itemDesc: 'Steak',
        itemNbr: 847,
        moveToFront: false,
        palletId: '5433',
        palletLocationId: 2344,
        palletLocationName: 'ABAR1-1',
        quickPick: false,
        salesFloorLocationId: 2344,
        salesFloorLocationName: 'ABAR1-1',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      },
      {
        assignedAssociate: 'Associate 4',
        category: 78,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 7,
        itemDesc: 'Chicken',
        itemNbr: 848,
        moveToFront: false,
        palletId: '5433',
        palletLocationId: 2344,
        palletLocationName: 'ABAR1-2',
        quickPick: false,
        salesFloorLocationId: 2344,
        salesFloorLocationName: 'ABAR1-2',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      },
      {
        assignedAssociate: 'Associate 3',
        category: 72,
        createTs: '2022-02-09T12:55:31.9633333Z',
        createdBy: 'Manager 1',
        id: 8,
        itemDesc: 'Juice',
        itemNbr: 846,
        moveToFront: false,
        palletId: '5432',
        palletLocationId: 2345,
        palletLocationName: 'BREW1-2',
        quickPick: false,
        salesFloorLocationId: 2345,
        salesFloorLocationName: 'BREW1-2',
        status: PickStatus.READY_TO_WORK,
        upcNbr: '000052900004'
      }
    ];
    renderer.render(
      <SalesFloorTabScreen
        readyToWorklist={salesPickList}
        dispatch={jest.fn()}
        refreshing={true}
        onRefresh={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
