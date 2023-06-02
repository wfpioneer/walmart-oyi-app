import moment from 'moment';
import { NavigationProp, StackActions } from '@react-navigation/native';
import { AuthorizeResult, refresh } from 'react-native-app-auth';
import { logoutUser, setUserTokens } from '../state/actions/User';
import store from '../state';
import { trackEvent } from './AppCenterTool';
import { clearEndTime } from '../state/actions/SessionTimeout';

const sessionLength = 2;
export const sessionEnd = (): number => moment(store.getState().User.userTokens.accessTokenExpirationDate).unix();

const attemptRefresh = async () => {
  const refreshConfig = {
    issuer: 'https://pfedcert.wal-mart.com',
    clientId: 'intl_sams_oyi_stg',
    redirectUrl: 'com.samsclub.intl.oyi://oauth',
    scopes: ['openid full']
  };

  const {
    refreshToken
  } = store.getState().User.userTokens;

  try {
    const refreshResponse = await refresh(refreshConfig, {
      refreshToken
    });
    store.dispatch(setUserTokens(refreshResponse as AuthorizeResult));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function validateSession(navigation: NavigationProp<any>, route?: string): Promise<void> {
  try {
    const endTime = store.getState().SessionTimeout;

    const {
      accessToken
    } = store.getState().User.userTokens;

    const introspectionResponse = await fetch('https://pfedcert.wal-mart.com/as/introspect.oauth2', {
      method: 'POST',
      body: new URLSearchParams({
        token: accessToken,
        token_type_hint: 'access_token',
        client_id: 'intl_sams_oyi_stg'
      }).toString(),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`
      }
    });

    const introspectionResponseJson = await introspectionResponse.json();

    introspectionResponseJson.active = false;

    if (introspectionResponseJson.active) {
      return Promise.resolve();
    }

    await attemptRefresh();

    return Promise.resolve();
  } catch (error) {
    trackEvent('user_session_timed_out', { lastPage: route });
    store.dispatch(logoutUser());
    // Replace the current screen with the LoginScreen
    navigation.dispatch(
      StackActions.replace('Login')
    );
    return Promise.reject(error);
  }
}

//   if (moment().isSameOrAfter(moment.unix(endTime))) {
//     trackEvent('user_session_timed_out', { lastPage: route });
//     store.dispatch(clearEndTime());
//     WMSSO.signOutUser().then(() => {
//       store.dispatch(logoutUser());
//       // Replace the current screen with the LoginScreen
//       navigation.dispatch(
//         StackActions.replace('Login')
//       );
//     });
//     return reject();
//   }
//   return resolve();
// });
