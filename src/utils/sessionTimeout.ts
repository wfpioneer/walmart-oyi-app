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

export function validateSession(navigation: any, route?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const endTime = store.getState().SessionTimeout;
    if (moment().isSameOrAfter(moment.unix(endTime))) {
      trackEvent('user_session_timed_out', {lastPage: route});
      store.dispatch(clearEndTime());
      WMSSO.signOutUser().then(() => {
        store.dispatch(logoutUser());
        navigation.replace('Login');
      });
      return reject();
    }
    return resolve();
  });
}
