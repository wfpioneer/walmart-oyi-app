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
  endTime.add(sessionLength, 'hours');
  return endTime.unix();
};

export function validateSession(navigation: any): (Promise<void>) {
  return new Promise((resolve, reject) => {
    const endTime = store.getState().SessionTimeout;
    if (moment().isSameOrAfter(moment(endTime))) {
      trackEvent('user_sign_out');
      store.dispatch(clearEndTime());
      WMSSO.signOutUser().then(() => {
        navigation.replace('Login');
        logoutUser();
      });
      return reject();
    }
    return resolve();
  });
}
