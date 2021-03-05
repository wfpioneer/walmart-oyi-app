import User from '../../models/User';

export const loginUser = (userPayload: User) => ({
  type: 'USER/LOGIN',
  payload: userPayload
});

export const logoutUser = () => ({
  type: 'USER/LOGOUT'
});

export const getFluffyRoles = () => ({
  type: 'USER/GET_FLUFFY_ROLES'
})
