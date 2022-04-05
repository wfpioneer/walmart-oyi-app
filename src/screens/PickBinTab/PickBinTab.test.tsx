import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PickBinTabScreen } from './PickBinTab';
import { mockPickLists } from '../../mockData/mockPickList';
import { PickStatus } from '../../models/Picking.d';
import User from '../../models/User';
import { mockConfig } from '../../mockData/mockConfig';

const user: User = {
  userId: 'vn51wu8',
  additional: {
    clockCheckResult: 'yo',
    displayName: 'Ravi Varman',
    loginId: 'vn51wu8',
    mailId: 'vn51wu8@homeoffice.wal-mart.com'
  },
  configs: mockConfig,
  countryCode: 'CN',
  domain: 'Homeoffice',
  features: [],
  siteId: 5597,
  token: 'gibberish'
};

describe('PickBinTabScreen', () => {
  describe('Tests rendering the PickBinTabScreen component', () => {
    it('Test renders the PickBinTabScreen component without AssignedToMe List and zone', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <PickBinTabScreen
          pickBinList={mockPickLists}
          user={user}
          isManualScanEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the PickBinTabScreen component with AssignedToMe List and zone', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickList = [...mockPickLists, {
        assignedAssociate: 'vn51wu8',
        category: 46,
        createTS: '10:32 AM 03/04/2022',
        createdBy: 'Associate 2',
        id: 4,
        itemDesc: 'Candy',
        itemNbr: 7344,
        moveToFront: true,
        palletId: 4321,
        palletLocationId: 1672,
        palletLocationName: 'C1-2-1',
        quickPick: false,
        salesFloorLocationId: 1673,
        salesFloorLocationName: 'C1-3',
        status: PickStatus.ACCEPTED_PICK,
        upcNbr: '000041800004'
      }];
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
