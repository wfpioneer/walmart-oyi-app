import AppCenter from 'appcenter';
import AppCenterCrashes from 'appcenter-crashes';
import AppCenterAnalytics from 'appcenter-analytics';
import { store } from '../../App';

export const initialize = () => {
  if (!__DEV__) {
    AppCenter.setLogLevel(AppCenter.LogLevel.VERBOSE);
    AppCenterCrashes.notifyUserConfirmation(AppCenterCrashes.UserConfirmation.ALWAYS_SEND);
    AppCenterCrashes.setEnabled(true);
    AppCenterAnalytics.setEnabled(true);
  }
};

export const trackEvent = (eventName: string, params: any = {}) => {
  const userState = store.getState().User;

  const submitParams = {
    ...params,
    userId: userState.userId,
    clubId: userState.siteId
  };
  return AppCenterAnalytics.trackEvent(eventName, submitParams);
};

export const setUserId = (userId: string) => AppCenter.setUserId(userId);
