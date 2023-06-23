import moment from 'moment';
import { NavigationProp, StackActions } from '@react-navigation/native';
import { AuthorizeResult, refresh } from 'react-native-app-auth';
import { logoutUser, setUserTokens } from '../state/actions/User';
import store from '../state';
import { trackEvent } from './AppCenterTool';
import { getEnvironment, getPingFedClientId } from './environment';

export const sessionEnd = (): number => moment(store.getState().User.userTokens.accessTokenExpirationDate).unix();

const attemptRefresh = async () => {
  const urls = getEnvironment();
  const refreshConfig = {
    issuer: urls.pingFedURL,
    clientId: getPingFedClientId(),
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
    const {
      accessToken, accessTokenExpirationDate
    } = store.getState().User.userTokens;

    if (moment(accessTokenExpirationDate).isBefore()) {
      return Promise.resolve();
    } else {
      const urls = getEnvironment();

      const introspectionResponse = await fetch(`${urls.pingFedURL}/as/introspect.oauth2`, {
        method: 'POST',
        body: new URLSearchParams({
          token: accessToken,
          token_type_hint: 'access_token',
          client_id: getPingFedClientId()
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
    }
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
