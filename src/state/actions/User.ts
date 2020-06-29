import User from '../../models/User';

export const loginUser = (userPayload: User) => ({
  type: 'USER/LOGIN',
  payload: userPayload
});

export const logoutUser = () => ({
  type: 'USER/LOGOUT'
});
