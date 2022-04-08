import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import { PickingState } from '../../state/reducers/Picking';
import { PickBinWorkflowScreen } from './PickBinWorkflowScreen';

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
      assignedAssociate: 't0s0og',
      status: PickStatus.ACCEPTED_BIN
    },
    {
      ...basePickItem,
      assignedAssociate: 't0s0og',
      status: PickStatus.ACCEPTED_PICK,
      id: 1,
      palletId: 40
    },
    {
      ...basePickItem,
      status: PickStatus.READY_TO_PICK,
      id: 2,
      palletId: 41
    },
    {
      ...basePickItem,
      id: 3,
      status: PickStatus.READY_TO_BIN,
      palletId: 42
    },
    {
      ...basePickItem,
      id: 4,
      status: PickStatus.READY_TO_BIN,
      palletId: 42
    },
    {
      ...basePickItem,
      assignedAssociate: 'vn50pz4',
      id: 5,
      status: PickStatus.ACCEPTED_PICK,
      quickPick: true,
      palletId: 44
    },
    {
      ...basePickItem,
      assignedAssociate: 'vn50pz4',
      id: 6,
      status: PickStatus.ACCEPTED_BIN,
      palletId: 45,
      palletLocationId: 5,
      palletLocationName: 'ABAR1-4',
      quickPick: true
    }
  ],
  selectedPicks: []
};

describe('PickBin Workflow render tests', () => {
  it('renders screen with ready to pick item selected', () => {
    const renderer = ShallowRenderer.createRenderer();

    const readyToPickPicks: PickingState = {
      ...pickingState,
      selectedPicks: [2]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={readyToPickPicks}
        userFeatures={[]}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with ready to bin items selected', () => {
    const renderer = ShallowRenderer.createRenderer();

    const readyToBinPicks: PickingState = {
      ...pickingState,
      selectedPicks: [3, 4]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={readyToBinPicks}
        userFeatures={[]}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted pick & current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const myAcceptedPicks: PickingState = {
      ...pickingState,
      selectedPicks: [5]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={myAcceptedPicks}
        userFeatures={[]}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted pick and not current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedPick: PickingState = {
      ...pickingState,
      selectedPicks: [1]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedPick}
        userFeatures={[]}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted pick, not current user, and manager', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedPick: PickingState = {
      ...pickingState,
      selectedPicks: [1]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedPick}
        userFeatures={['manager approval']}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted bin & current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const myAcceptedBin: PickingState = {
      ...pickingState,
      selectedPicks: [6]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={myAcceptedBin}
        userFeatures={[]}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted bin & not current user', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedBin: PickingState = {
      ...pickingState,
      selectedPicks: [0]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedBin}
        userFeatures={[]}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with accepted bin, not current user, and manager', () => {
    const renderer = ShallowRenderer.createRenderer();

    const otherAcceptedBin: PickingState = {
      ...pickingState,
      selectedPicks: [0]
    };

    renderer.render(
      <PickBinWorkflowScreen
        pickingState={otherAcceptedBin}
        userFeatures={['manager approval']}
        userId="vn50pz4"
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
