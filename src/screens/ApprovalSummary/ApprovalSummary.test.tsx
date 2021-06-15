import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ApprovalSummaryScreen } from './ApprovalSummary';
import { mockApprovals, mockSelectedApprovals } from '../../mockData/mockApprovalItem';

let navigationProp: NavigationProp<any>;
describe('ApprovalSummaryScreen', () => {
  describe('Tests rendering the Summary Page', () => {
    const approveRoute:RouteProp<any, string> = {
      key: '',
      name: 'ApproveSummary'
    };
    const rejectRoute:RouteProp<any, string> = {
      key: '',
      name: 'RejectSummary'
    };

    it('Renders "summary of approvals" translation if Approve route is selected ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalSummaryScreen
          route={approveRoute}
          navigation={navigationProp}
          approvalList={[]}
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
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
