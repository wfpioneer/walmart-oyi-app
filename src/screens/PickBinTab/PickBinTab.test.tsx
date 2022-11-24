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
          dispatch={jest.fn()}
          refreshing={false}
          onRefresh={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the PickBinTabScreen component with AssignedToMe List and zone', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickList = [...mockPickLists, {
        assignedAssociate: 'vn51wu8',
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
      }];
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={false}
          onRefresh={jest.fn}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Test renders the PickBinTabScreen component while refreshing', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickList = [...mockPickLists, {
        assignedAssociate: 'vn51wu8',
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
      }];
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={true}
          onRefresh={jest.fn}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Test renders PickBinTabScreen component with multi pick enabled and atleast 1 pick ready to start', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickList = [...mockPickLists, {
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
      }];
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={false}
          onRefresh={jest.fn}
          multiBinEnabled={false}
          multiPickEnabled={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Test renders PickBinTabScreen component with multi bin enabled and atleast 1 bin ready to start', () => {
      const renderer = ShallowRenderer.createRenderer();
      const newMockPickList = [...mockPickLists, {
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
        upcNbr: '000041800004',
        isSelected: true
      }];
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={false}
          onRefresh={jest.fn}
          multiBinEnabled={true}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
