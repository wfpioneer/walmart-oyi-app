import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Pallet } from '../../models/PalletManagementTypes';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { PickingState } from '../../state/reducers/Picking';
import { SalesFloorWorkflowScreen } from './SalesFloorWorkflow';

const testPallet: Pallet = {
  items: [],
  palletInfo: {
    id: 1,
    createDate: 'yesterday'
  }
};

const basePickItem: PickListItem = {
  assignedAssociate: '',
  category: 3,
  createTS: 'yesterday',
  createdBy: 'Guude',
  id: 0,
  itemDesc: 'generic description',
  itemNbr: 1,
  moveToFront: false,
  palletId: 43,
  palletLocationId: 4,
  palletLocationName: 'ABAR1-2',
  quickPick: false,
  salesFloorLocationId: 5,
  salesFloorLocationName: 'ABAR1-3',
  status: PickStatus.DELETED,
  upcNbr: '1234567890123'
};

const pickingState: PickingState = {
  pickList: [
    {
      ...basePickItem,
      status: PickStatus.READY_TO_WORK
    }
  ],
  selectedPicks: [0]
};

describe('Sales floor workflow tests', () => {
  it('renders the screen with one item on pallet', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={pickingState}
        palletToWork={testPallet}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with several items on the pallet', () => {
    const renderer = ShallowRenderer.createRenderer();

    const multiPicksState: PickingState = {
      pickList: [
        ...pickingState.pickList,
        {
          ...basePickItem,
          id: 1,
          status: PickStatus.READY_TO_WORK
        }
      ],
      selectedPicks: [0, 1]
    };

    renderer.render(
      <SalesFloorWorkflowScreen
        dispatch={jest.fn()}
        pickingState={multiPicksState}
        palletToWork={testPallet}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
