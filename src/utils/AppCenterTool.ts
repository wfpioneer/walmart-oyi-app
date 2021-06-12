import AppCenter from 'appcenter';
import AppCenterCrashes from 'appcenter-crashes';
import AppCenterAnalytics from 'appcenter-analytics';
import { store } from '../../App';

export const initialize = (): void => {
  if (!__DEV__) {
    AppCenter.setLogLevel(AppCenter.LogLevel.VERBOSE).then();
    AppCenterCrashes.notifyUserConfirmation(AppCenterCrashes.UserConfirmation.ALWAYS_SEND);
    AppCenterCrashes.setEnabled(true).then();
    AppCenterAnalytics.setEnabled(true).then();
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
  AppCenterAnalytics.trackEvent(eventName, submitParams).then();
};

export const setUserId = (userId: string): void => {
  AppCenter.setUserId(userId).then();
};
