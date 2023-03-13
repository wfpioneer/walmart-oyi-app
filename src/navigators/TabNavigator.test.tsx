import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  TabNavigatorStack
} from './TabNavigator';

const User = {
  additional: {
    clockCheckResult: '',
    displayName: '',
    loginId: '',
    mailId: ''
  },
  countryCode: '',
  domain: '',
  siteId: 0,
  token: '',
  userId: '',
  features: [],
  configs: {
    locationManagement: false,
    locationManagementEdit: false,
    palletManagement: false,
    settingsTool: false,
    printingUpdate: false,
    binning: false,
    palletExpiration: false,
    backupCategories: '',
    picking: false,
    areas: [],
    enableAreaFilter: false,
    palletWorklists: false,
    createPallet: false,
    auditWorklists: false,
    showRollOverAudit: false,
    showOpenAuditLink: false,
    scanRequired: false,
    showCalculator: false,
    multiBin: false,
    multiPick: false,
    showItemImage: false,
    showFeedback: false,
    reserveAdjustment: false
  }
};
const User1 = {
  additional: {
    clockCheckResult: '',
    displayName: '',
    loginId: '',
    mailId: ''
  },
  countryCode: '',
  domain: '',
  siteId: 0,
  token: '',
  userId: '',
  features: ['manager approval'],
  configs: {
    locationManagement: true,
    locationManagementEdit: true,
    palletManagement: false,
    settingsTool: true,
    printingUpdate: false,
    binning: false,
    palletExpiration: false,
    backupCategories: '',
    picking: false,
    areas: [],
    enableAreaFilter: false,
    palletWorklists: false,
    createPallet: false,
    auditWorklists: false,
    showRollOverAudit: false,
    showOpenAuditLink: false,
    scanRequired: false,
    showCalculator: false,
    multiBin: false,
    multiPick: false,
    showItemImage: false,
    showFeedback: false,
    reserveAdjustment: false
  }
};
describe('Tab Navigator', () => {
  it('Render ReviewItemsNavigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <TabNavigatorStack
        user={User}
        selectedAmount={0}
        dispatch={jest.fn()}
        palletWorklists={false}
        auditWorklists={false}
        isBottomTabEnabled={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Render ReviewItemsNavigator with user features', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <TabNavigatorStack
        user={User1}
        selectedAmount={0}
        dispatch={jest.fn()}
        palletWorklists={true}
        auditWorklists={true}
        isBottomTabEnabled={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
