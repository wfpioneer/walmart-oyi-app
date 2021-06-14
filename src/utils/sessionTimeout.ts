// @ts-ignore
import WMSSO from 'react-native-wmsso';
import moment from 'moment';
import { NavigationProp, StackActions } from '@react-navigation/native';
import { logoutUser } from '../state/actions/User';
import store from '../state/index';
import { trackEvent } from './AppCenterTool';
import { clearEndTime } from '../state/actions/SessionTimeout';

const sessionLength = 2;
export const sessionEnd = (): number => {
  const endTime = moment();
  endTime.add(sessionLength, 'hours');
  return endTime.unix();
};

export function validateSession(navigation: NavigationProp<any>, route?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const endTime = store.getState().SessionTimeout;

    if (moment().isSameOrAfter(moment.unix(endTime))) {
      trackEvent('user_session_timed_out', { lastPage: route });
      store.dispatch(clearEndTime());
      WMSSO.signOutUser().then(() => {
        store.dispatch(logoutUser());
        // Replace the current screen with the LoginScreen
        navigation.dispatch(
          StackActions.replace('Login')
        );
      });
      return reject();
    }
    return resolve();
  });
}
