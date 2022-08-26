import omit from 'lodash/omit';
import {
  assignFluffyFeatures,
  loginUser,
  logoutUser,
  setConfigs
} from '../actions/User';
import { UserReducer, initialState } from './User';
import mockUser from '../../mockData/mockUser';
import { mockAreas } from '../../mockData/mockConfig';
import User from '../../models/User';

describe('testing User reducer', () => {
  it('testing User reducer', () => {
    const testInitialState = initialState;
    let testChangedState: User = { ...mockUser, features: [], configs: initialState.configs };
    // loginUser action
    let testResults = UserReducer(testInitialState, loginUser(mockUser));
    expect(testResults).toStrictEqual(testChangedState);
    // assignFluffyFeatures action
    const testFluffyFeatures: string[] = ['feature1', 'feature2'];
    testChangedState = { ...initialState, features: testFluffyFeatures };
    testResults = UserReducer(testInitialState, assignFluffyFeatures(testFluffyFeatures));
    expect(testResults).toStrictEqual(testChangedState);
    // setConfigs action
    const mockConfig = {
      locationManagement: false,
      locMgmtEdit: false,
      palletManagement: false,
      settingsTool: false,
      printingUpdate: false,
      binning: false,
      palletExpiration: false,
      backupCategories: '',
      picking: false,
      areas: mockAreas,
      enableAreaFilter: false,
      palletWorklists: false,
      addtItemDetails: false,
      createPallet: false,
      auditWorklists: false,
      showRollOverAuditComplete: false
    };
    const testConfig = { ...mockConfig, locMgmtEdit: false };
    testChangedState = {
      ...initialState,
      configs: {
        ...omit(mockConfig, ['locMgmtEdit', 'addtItemDetails']),
        locationManagementEdit: false,
        additionalItemDetails: false
      }
    };
    testResults = UserReducer(testInitialState, setConfigs(testConfig));
    expect(testResults).toStrictEqual(testChangedState);
    // logoutUser action
    testResults = UserReducer(testInitialState, logoutUser());
    expect(testResults).toStrictEqual(testInitialState);
  });
});
