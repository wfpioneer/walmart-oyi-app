import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PickListItem, PickStatus } from '../../models/Picking.d';
import User from '../../models/User';
import { QuickPickTabScreen } from './QuickPickTab';

const mockUser: User = {
  userId: 'vn50pz4',
  additional: {
    clockCheckResult: 'yes',
    displayName: 'Kahl',
    loginId: 'vn50pz4',
    mailId: 'vn50pz4@homeoffice.wal-mart.com'
  },
  configs: {
    backupCategories: '',
    binning: true,
    locationManagement: true,
    locationManagementEdit: true,
    palletExpiration: true,
    palletManagement: true,
    picking: true,
    printingUpdate: true,
    settingsTool: true
  },
  countryCode: 'US',
  domain: 'Home Office',
  features: [],
  siteId: 6233,
  token: 'i is token of tokenating'
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
  quickPick: true,
  salesFloorLocationId: 5,
  salesFloorLocationName: 'ABAR1-3',
  status: PickStatus.DELETED,
  upcNbr: '1234567890123'
};

describe('Quick pick tab render tests', () => {
  it('renders the screen with no picking items', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(<QuickPickTabScreen quickPicks={[]} user={mockUser} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with picking items all assigned to me', () => {
    const renderer = ShallowRenderer.createRenderer();
    const myPickItems: PickListItem[] = [
      {
        ...basePickItem,
        assignedAssociate: 'vn50pz4',
        status: PickStatus.READY_TO_WORK
      },
      {
        ...basePickItem,
        assignedAssociate: 'vn50pz4',
        id: 1,
        status: PickStatus.READY_TO_BIN
      },
      {
        ...basePickItem,
        assignedAssociate: 'vn50pz4',
        id: 2,
        status: PickStatus.READY_TO_PICK
      }
    ];

    renderer.render(<QuickPickTabScreen quickPicks={myPickItems} user={mockUser} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with not all items assigned to me', () => {
    const renderer = ShallowRenderer.createRenderer();
    const quickPickItems: PickListItem[] = [
      {
        ...basePickItem,
        assignedAssociate: 't0s0og',
        status: PickStatus.READY_TO_WORK
      },
      {
        ...basePickItem,
        assignedAssociate: 'vn50pz4',
        id: 1,
        status: PickStatus.READY_TO_BIN
      },
      {
        ...basePickItem,
        assignedAssociate: 'vn50pz4',
        id: 2,
        status: PickStatus.READY_TO_PICK
      }
    ];

    renderer.render(<QuickPickTabScreen quickPicks={quickPickItems} user={mockUser} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});