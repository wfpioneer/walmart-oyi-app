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
  // Removes undefined values from the event properties
  const cleanedParams = Object.fromEntries(Object.entries(params).filter(([k, v]) => v !== undefined));
  const submitParams = {
    ...cleanedParams,
    userId: userState.userId,
    clubId: userState.siteId.toString(),
    country: userState.countryCode
  };
  AppCenterAnalytics.trackEvent(eventName, submitParams);
};

export const setUserId = (userId: string): void => {
  AppCenter.setUserId(userId);
};
