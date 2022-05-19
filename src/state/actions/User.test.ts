import {
  ASSIGN_FLUFFY_FEATURES,
  SET_CONFIGS,
  USER_LOGIN,
  USER_LOGOUT,
  assignFluffyFeatures,
  loginUser,
  logoutUser,
  setConfigs
} from './User';
import mockUser from '../../mockData/mockUser';
import { mockConfig } from '../../mockData/mockConfig';

describe('test action creators for User', () => {
  it('test action creators for User', () => {
    // loginUser action
    const loginUserResult = loginUser(mockUser);
    expect(loginUserResult).toStrictEqual({
      type: USER_LOGIN,
      payload: mockUser
    });
    // logoutUser action
    const logoutUserResult = logoutUser();
    expect(logoutUserResult).toStrictEqual({ type: USER_LOGOUT });
    // assignFluffyFeatures action
    const testFeaturesList = ['feature1', 'feature2'];
    const assignFluffyFeaturesResult = assignFluffyFeatures(testFeaturesList);
    expect(assignFluffyFeaturesResult).toStrictEqual({
      type: ASSIGN_FLUFFY_FEATURES,
      payload: testFeaturesList
    });
    // setConfigs action
    const testConfig = { ...mockConfig, locMgmtEdit: true };
    const setConfigsResult = setConfigs(testConfig);
    expect(setConfigsResult).toStrictEqual({
      type: SET_CONFIGS,
      payload: testConfig
    });
  });
});
