import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { PickBinTabScreen, renderMultipickConfirmationDialog } from './PickBinTab';
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
          showMultiPickConfirmationDialog={false}
          setShowMultiPickConfirmationDialog={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the PickBinTabScreen component with accept multiPick and multiBin buttons', () => {
      const renderer = ShallowRenderer.createRenderer();
      const flaggedUser: User = {
        ...user,
        configs: { ...user.configs, multiBin: true, multiPick: true }
      };
      renderer.render(
        <PickBinTabScreen
          pickBinList={mockPickLists}
          user={flaggedUser}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={false}
          onRefresh={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
          showMultiPickConfirmationDialog={false}
          setShowMultiPickConfirmationDialog={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the PickBinTabScreen component with "cancel & continue" buttons if multiPick/multiBin is enabled',
      () => {
        const renderer = ShallowRenderer.createRenderer();
        const flaggedUser: User = {
          ...user,
          configs: { ...user.configs, multiBin: true, multiPick: true }
        };
        renderer.render(
          <PickBinTabScreen
            pickBinList={mockPickLists}
            user={flaggedUser}
            isManualScanEnabled={false}
            dispatch={jest.fn()}
            refreshing={false}
            onRefresh={jest.fn()}
            multiBinEnabled={true}
            multiPickEnabled={true}
            showMultiPickConfirmationDialog={false}
            setShowMultiPickConfirmationDialog={jest.fn()}
          />
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

    it('Test renders the PickBinTabScreen component with AssignedToMe List and zone', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={false}
          onRefresh={jest.fn}
          showMultiPickConfirmationDialog={false}
          setShowMultiPickConfirmationDialog={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Test renders the PickBinTabScreen component while refreshing', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={true}
          onRefresh={jest.fn}
          showMultiPickConfirmationDialog={false}
          setShowMultiPickConfirmationDialog={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Test renders the PickBinTabScreen component when user clicks continue on multi pick/bin mode', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <PickBinTabScreen
          pickBinList={newMockPickList}
          user={user}
          isManualScanEnabled={false}
          dispatch={jest.fn()}
          refreshing={true}
          onRefresh={jest.fn}
          showMultiPickConfirmationDialog={true}
          setShowMultiPickConfirmationDialog={jest.fn()}
          multiBinEnabled={false}
          multiPickEnabled={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests PickBinTab externalized function tests', () => {
    const mockShowMultiPickConfirmationDialog = true;
    const mockSetShowMultiPickConfirmationDialog = jest.fn();
    const updatedPickList = mockPickLists.map(pickList => ({ ...pickList, isSelected: true }));
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
          showMultiPickConfirmationDialog={false}
          setShowMultiPickConfirmationDialog={jest.fn()}
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
          showMultiPickConfirmationDialog={false}
          setShowMultiPickConfirmationDialog={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('tests rendered output for renderMultipickConfirmationDialog when multiPick was enabled', () => {
      const mockMultiBin = false;
      const mockMultiPick = true;
      const { toJSON } = render(renderMultipickConfirmationDialog(
        updatedPickList,
        mockShowMultiPickConfirmationDialog,
        mockSetShowMultiPickConfirmationDialog,
        mockMultiBin,
        mockMultiPick
      ));
      expect(toJSON()).toMatchSnapshot();
    });
    it('tests rendered output for renderMultipickConfirmationDialog when multiBin was enabled', () => {
      const mockMultiBin = true;
      const mockMultiPick = false;
      const { toJSON } = render(renderMultipickConfirmationDialog(
        updatedPickList,
        mockShowMultiPickConfirmationDialog,
        mockSetShowMultiPickConfirmationDialog,
        mockMultiBin,
        mockMultiPick
      ));
      expect(toJSON()).toMatchSnapshot();
    });
    it('tests renderMultipickConfirmationDialog actions', () => {
      const mockMultiBin = true;
      const mockMultiPick = false;
      const { getByTestId } = render(renderMultipickConfirmationDialog(
        updatedPickList,
        mockShowMultiPickConfirmationDialog,
        mockSetShowMultiPickConfirmationDialog,
        mockMultiBin,
        mockMultiPick
      ));
      const cancelButton = getByTestId('cancelButton');
      const acceptButton = getByTestId('acceptButton');
      fireEvent.press(cancelButton);
      expect(mockSetShowMultiPickConfirmationDialog).toHaveBeenCalledWith(false);
      fireEvent.press(acceptButton);
      // TODO: Need to check whether the API been properly called
      expect(mockSetShowMultiPickConfirmationDialog).toHaveBeenCalledWith(false);
    });
  });
});
