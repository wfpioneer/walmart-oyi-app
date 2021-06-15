import User from '../../models/User';

export const USER_LOGIN = 'USER/LOGIN';
export const USER_LOGOUT = 'USER/LOGOUT';
export const ASSIGN_FLUFFY_FEATURES = 'USER/ASSIGN_FLUFFY_FEATURES';

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

export type Actions =
  | ReturnType<typeof loginUser>
  | ReturnType<typeof logoutUser>
  | ReturnType<typeof assignFluffyFeatures>;
