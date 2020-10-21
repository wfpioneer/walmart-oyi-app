// @ts-ignore
import WMSSO from 'react-native-wmsso';
import moment from 'moment';
import { logoutUser } from '../state/actions/User';
import { store } from '../../App';
import { trackEvent } from './AppCenterTool';
import { clearEndTime } from '../state/actions/SessionTimeout';

const sessionLength = 2;
export const sessionEnd = () => {
  const endTime = moment();
  return endTime.add(sessionLength, 'hours');
};

export function validateSession(navigation: any): (void) {
  const endTime = store.getState().SessionTimeout;
  if (moment().isSameOrAfter(endTime)) {
    trackEvent('user_sign_out');
    clearEndTime();
    WMSSO.signOutUser().then(() => {
      navigation.replace('Login');
      logoutUser();
    });
  };
}
