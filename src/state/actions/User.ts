import { ConfigResponse } from '../../services/Config.service';
import User from '../../models/User';

export const USER_LOGIN = 'USER/LOGIN';
export const USER_LOGOUT = 'USER/LOGOUT';
export const ASSIGN_FLUFFY_FEATURES = 'USER/ASSIGN_FLUFFY_FEATURES';
export const SET_CONFIGS = 'USER/SET_CONFIGS';

export const loginUser = (userPayload: User) => ({
  type: USER_LOGIN,
  payload: userPayload
} as const);

export const logoutUser = () => ({
  type: USER_LOGOUT
} as const);

export const assignFluffyFeatures = (resultPayload: string[]) => ({
  type: ASSIGN_FLUFFY_FEATURES,
  payload: resultPayload
} as const);

export const setConfigs = (configs: ConfigResponse) => ({
  type: SET_CONFIGS,
  payload: configs
} as const);

export type Actions =
  | ReturnType<typeof loginUser>
  | ReturnType<typeof logoutUser>
  | ReturnType<typeof assignFluffyFeatures>
  | ReturnType<typeof setConfigs>;
