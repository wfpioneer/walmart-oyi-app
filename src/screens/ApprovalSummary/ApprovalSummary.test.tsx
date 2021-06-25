import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ApprovalSummaryScreen } from './ApprovalSummary';
import { mockApprovals, mockSelectedApprovals } from '../../mockData/mockApprovalItem';

let navigationProp: NavigationProp<any>;
describe('ApprovalSummaryScreen', () => {
  const approveRoute:RouteProp<any, string> = {
    key: '',
    name: 'ApproveSummary'
  };
  const rejectRoute:RouteProp<any, string> = {
    key: '',
    name: 'RejectSummary'
  };
  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  describe('Tests rendering the Summary Page: ', () => {
    it('Renders "summary of approvals" translation if Approve route is selected ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={[]}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders "summary of rejections" translation if Reject route is selected', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalSummaryScreen
          route={rejectRoute}
          navigation={navigationProp}
          approvalList={[]}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders zeroes for all on hands changes if no approval items are selected', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={mockApprovals}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders increased/decreased on hands changes for selected approval items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={mockSelectedApprovals}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders `item` translation for selected approval items with one onHands increase/decrease change ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={[mockSelectedApprovals[0], mockSelectedApprovals[1]]}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders `items` translation for selected approval items with mulitple onHands changes', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={mockSelectedApprovals}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering update approval api response: ', () => {
    it('Renders loading indicator when waiting for Update Approval Api response ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const updateApprovalIsWaiting = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={mockSelectedApprovals}
          approvalApi={updateApprovalIsWaiting}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering the update approval api error modal: ', () => {
    it('Renders error pop-up if errorModalVisible is set to true ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={mockSelectedApprovals}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={true}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders no error pop-up if errorModalVisible is set to false', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={mockSelectedApprovals}
          approvalApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          errorModalVisible={false}
          setErrorModalVisible={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
