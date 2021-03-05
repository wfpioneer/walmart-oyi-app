import User from '../../models/User';

export const loginUser = (userPayload: User) => ({
  type: 'USER/LOGIN',
  payload: userPayload
});

export const logoutUser = () => ({
  type: 'USER/LOGOUT'
});

export const assignFluffyRoles = (resultPayload: string[]) => ({
  type: 'USER/ASSIGN_FLUFFY_ROLES',
  payload: resultPayload
});
