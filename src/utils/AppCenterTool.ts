import AppCenter from 'appcenter';
import AppCenterCrashes from 'appcenter-crashes';
import AppCenterAnalytics from 'appcenter-analytics';
import store from '../state';

export const initialize = (): void => {
  if (!__DEV__) {
    AppCenter.setLogLevel(AppCenter.LogLevel.VERBOSE);
    AppCenterCrashes.notifyUserConfirmation(AppCenterCrashes.UserConfirmation.ALWAYS_SEND);
    AppCenterCrashes.setEnabled(true);
    AppCenterAnalytics.setEnabled(true);
  }
};

export const trackEvent = (eventName: string, params: any = {}): void => {
  const userState = store.getState().User;

  const submitParams = {
    ...params,
    userId: userState.userId,
    clubId: userState.siteId,
    country: userState.countryCode
  };
  AppCenterAnalytics.trackEvent(eventName, submitParams);
};

export const setUserId = (userId: string): void => {
  AppCenter.setUserId(userId);
};
