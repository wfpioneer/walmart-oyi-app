import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, {
  Dispatch, EffectCallback, useEffect
} from 'react';
import { useDispatch } from 'react-redux';
import {
  NativeModules, Platform, Text, View
} from 'react-native';
import Config from 'react-native-config';
// eslint-disable-next-line import/no-extraneous-dependencies
import WMSingleSignOn, {
  SSOEnv,
  SSOPingFedEventData,
  SSOPingFedEvents,
  SSOUser,
  ssoEventEmitter
} from 'react-native-ssmp-sso';
import Toast from 'react-native-toast-message';
import { Printer, PrinterType } from '../../models/Printer';
import Button, { ButtonType } from '../../components/buttons/Button';
import EnterClubNbrForm from '../../components/EnterClubNbrForm/EnterClubNbrForm';
import styles from './Login.style';
import {
  assignFluffyFeatures, loginUser, logoutUser, setConfigs
} from '../../state/actions/User';
import { GET_CLUB_CONFIG, GET_FLUFFY_ROLES } from '../../state/actions/asyncAPI';
import {
  getClubConfig, getFluffyFeatures, updateUserConfig
} from '../../state/actions/saga';
import User from '../../models/User';
import { setLanguage, strings } from '../../locales';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setUserId, trackEvent } from '../../utils/AppCenterTool';
import { sessionEnd } from '../../utils/sessionTimeout';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CustomModalComponent, ModalCloseIcon } from '../Modal/Modal';
import { getBuildEnvironment } from '../../utils/environment';
import COLOR from '../../themes/Color';
import IconButton, { IconButtonType } from '../../components/buttons/IconButton';
import { AsyncState } from '../../models/AsyncState';
import {
  getLocationLabelPrinter,
  getPalletLabelPrinter,
  getPriceLabelPrinter,
  getPrinterList,
  savePrinter
} from '../../utils/asyncStorageUtils';
import {
  setLocationLabelPrinter,
  setPalletLabelPrinter,
  setPriceLabelPrinter,
  setPrinterList
} from '../../state/actions/Print';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

export const resetClubConfigApiState = () => ({ type: GET_CLUB_CONFIG.RESET });
export const resetFluffyFeaturesApiState = () => ({ type: GET_FLUFFY_ROLES.RESET });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');

// Since CN Associate JobCodes are inconsistent, this set of roles will be added
// to all successful fluffy responses for CN
// If we encounter future scenarios, we can modify this set of Associate roles
// NOTE: This is only a stop-gap until a better solution is found
const CN_ASSOCIATE_ROLES = ['on hands change'];

// This method merges our hard-coded Associate roles with our fluffy response
const addCNAssociateRoleOverrides = (
  fluffyRoles: string[]
): string[] => Array.from(new Set([...fluffyRoles, ...CN_ASSOCIATE_ROLES]));

// TODO correct all the function definitions (specifically return types)
export interface LoginScreenProps {
  user: User;
  navigation: NavigationProp<any>;
  getFluffyApiState: AsyncState;
  getClubConfigApiState: AsyncState;
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
}

const getSystemLanguage = (): string => {
  let sysLang = '';
  if (NativeModules.I18nManager) {
    sysLang = NativeModules.I18nManager.localeIdentifier;
  } else if (NativeModules.SettingsManager?.settings?.AppleLanguages?.length) {
    // eslint-disable-next-line prefer-destructuring
    sysLang = NativeModules.SettingsManager.settings.AppleLanguages[0];
  }

  if (sysLang) {
    sysLang = sysLang.substring(0, 2);
    if (sysLang !== 'en' && sysLang !== 'es' && sysLang !== 'zh') {
      return 'en';
    }
    return sysLang;
  }
  return 'en';
};

const userIsSignedIn = (user: User): boolean => user.userId !== '' && user.token !== '';
const SelectCountryCodeModal = (props: {onSignOut: () => void, onSubmitMX:() => void, onSubmitCN: () => void}) => {
  const { onSignOut, onSubmitCN, onSubmitMX } = props;
  return (
    <>
      <View style={styles.closeContainer}>
        <IconButton
          icon={ModalCloseIcon}
          type={IconButtonType.NO_BORDER}
          onPress={() => onSignOut()}
          style={styles.closeButton}
        />
      </View>
      <Text style={styles.titleText}>
        Please select a country to sign into
      </Text>
      <View style={styles.buttonRow}>
        <Button
          title="MX"
          onPress={() => onSubmitMX()}
          type={ButtonType.SOLID_WHITE}
          titleColor={COLOR.MAIN_THEME_COLOR}
          style={styles.affirmButton}
        />
        <Button
          title="CN"
          onPress={() => onSubmitCN()}
          type={ButtonType.PRIMARY}
          style={styles.affirmButton}
        />
      </View>
    </>
  );
};

export const onLoginSuccess = (user: SSOUser, userToken: string, dispatch: Dispatch<any>) => {
  const siteId = user.siteId && user.siteId !== 'NOT_FOUND' ? Number(user.siteId) : 0;

  setLanguage(getSystemLanguage());
  setUserId(user.userId);
  dispatch(loginUser({
    ...user,
    siteId,
    token: userToken,
    additional: {
      displayName: user.displayName ?? '',
      clockCheckResult: '',
      loginId: '',
      mailId: user.emailId ?? ''
    },
    features: []
  }));
  trackEvent('user_sign_in');
  if (siteId && user.countryCode !== 'US') {
    dispatch(getFluffyFeatures({
      ...user,
      siteId,
      token: userToken,
      additional: {
        displayName: user.displayName ?? '',
        clockCheckResult: '',
        loginId: '',
        mailId: user.emailId ?? ''
      },
      features: []
    }));
  }
};
export const signInUser = (dispatch: Dispatch<any>): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  Config.ENVIRONMENT !== 'prod' ? WMSingleSignOn.setEnv(SSOEnv.CERT) : WMSingleSignOn.setEnv(SSOEnv.PROD);
  let userToken = '';
  WMSingleSignOn.getFreshAccessToken().then(token => {
    userToken = token;
  });

  WMSingleSignOn.getUser().then((user: SSOUser) => {
    onLoginSuccess(user, userToken, dispatch);
  }).catch(() => {
    WMSingleSignOn.signIn('MainActivity');
  });
};

export const signOutUser = (dispatch: Dispatch<any>): void => {
  dispatch(showActivityModal());
  trackEvent('user_sign_out', { lastPage: 'Login' });
  WMSingleSignOn.signOut('MainActivity', true).then(() => {
    dispatch(logoutUser());
    if (Platform.OS === 'android') {
      dispatch(hideActivityModal());
    }
  });
};

export const userConfigsApiHook = (
  getFluffyApiState: AsyncState,
  getClubConfigApiState: AsyncState,
  user: User,
  dispatch: Dispatch<any>,
  getPrinterDetailsFromAsyncStorage: (dispatchAction: Dispatch<any>) => Promise<void>,
  navigation: NavigationProp<any>
) => {
  if (getFluffyApiState.isWaiting || getClubConfigApiState.isWaiting) {
    dispatch(showActivityModal());
  }

  if (!getFluffyApiState.isWaiting && getFluffyApiState.result) {
    if (getFluffyApiState.result.status === 200) {
      const userCountryCode = user.countryCode.toUpperCase();
      const fluffyResultData = getFluffyApiState.result.data;
      const fluffyFeatures = userCountryCode === 'CN' ? addCNAssociateRoleOverrides(fluffyResultData)
        : fluffyResultData;
      dispatch(assignFluffyFeatures(fluffyFeatures));
    }
    dispatch(resetFluffyFeaturesApiState());
    dispatch(getClubConfig());
    dispatch(updateUserConfig());
  } else if (getFluffyApiState.error) {
    // TODO Display toast/popup letting user know roles could not be retrieved
    dispatch(getClubConfig());
    dispatch(resetFluffyFeaturesApiState());
    dispatch(updateUserConfig());
  }

  if (!getClubConfigApiState.isWaiting && getClubConfigApiState.result) {
    dispatch(setConfigs(getClubConfigApiState.result.data));
    if (getClubConfigApiState.result.data.printingUpdate) {
      getPrinterDetailsFromAsyncStorage(dispatch);
    }
    dispatch(hideActivityModal());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }]
    });
    dispatch(setEndTime(sessionEnd()));
  } else if (getClubConfigApiState.error) {
    // TODO Display toast/popup for error
    dispatch(hideActivityModal());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }]
    });
    dispatch(setEndTime(sessionEnd()));
  }
};

export const getPrinterDetailsFromAsyncStorage = async (dispatch: Dispatch<any>): Promise<void> => {
  const printerList = await getPrinterList();
  const priceLabelPrinter = await getPriceLabelPrinter();
  const palletLabelPrinter = await getPalletLabelPrinter();
  const locationLabelPrinter = await getLocationLabelPrinter();
  if (printerList && printerList.length > 0) {
    const defPrinter = printerList.find(obj => obj.id === '000000000000');
    if (defPrinter) {
      defPrinter.desc = strings('GENERICS.DEFAULT');
      defPrinter.name = strings('PRINT.FRONT_DESK');
    }
    dispatch(setPrinterList(printerList));
  } else {
    const defaultPrinter: Printer = {
      type: PrinterType.LASER,
      name: strings('PRINT.FRONT_DESK'),
      desc: strings('GENERICS.DEFAULT'),
      id: '000000000000',
      labelsAvailable: ['price']
    };
    dispatch(setPrinterList([defaultPrinter]));
    savePrinter(defaultPrinter);
  }
  if (priceLabelPrinter && priceLabelPrinter.id === '000000000000') {
    priceLabelPrinter.desc = strings('GENERICS.DEFAULT');
    priceLabelPrinter.name = strings('PRINT.FRONT_DESK');
  }
  dispatch(setPriceLabelPrinter(priceLabelPrinter));
  dispatch(setPalletLabelPrinter(palletLabelPrinter));
  dispatch(setLocationLabelPrinter(locationLabelPrinter));
};

export const LoginScreen = (props: LoginScreenProps) => {
  const {
    user,
    getFluffyApiState,
    getClubConfigApiState,
    navigation,
    dispatch,
    useEffectHook
  } = props;

  useEffectHook(() => {
    WMSingleSignOn.setRedirectUri('com.walmart.intl.oyi://SSOLogin');
    const eventTypes = SSOPingFedEvents.types;
    ssoEventEmitter.addListener(SSOPingFedEvents.name, (event: SSOPingFedEventData) => {
      switch (event.action) {
        case eventTypes.authSuccess:
          signInUser(dispatch);
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: `${strings('GENERICS.SIGN_IN')} ${strings('GENERICS.UPDATED')}`,
            visibilityTime: SNACKBAR_TIMEOUT
          });
          break;
        case eventTypes.error: {
          const errorException = event.error.replace('AuthorizationException: ', '');
          const pingError = JSON.parse(errorException);
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: pingError.error || pingError.errorDescription,
            visibilityTime: SNACKBAR_TIMEOUT
          });
          break;
        }
        default:
          break;
      }
    });

    return () => {
      ssoEventEmitter.removeAllListeners(SSOPingFedEvents.name);
    };
  }, [ssoEventEmitter]);

  useEffectHook(() => {
    signInUser(dispatch);
    // this following snippet is mostly for iOS, as
    // I need it to automatically call signInUser when we go back to the login screen
    if (Platform.OS === 'ios') {
      navigation.addListener('focus', () => {
        signInUser(dispatch);
      });
    }
    navigation.addListener('blur', () => {
      dispatch(resetClubConfigApiState());
    });

    return () => {
      if (Platform.OS === 'ios') {
        navigation.removeListener('focus', () => {});
      }
      navigation.removeListener('blur', () => {});
    };
  }, [navigation]);

  useEffectHook(() => userConfigsApiHook(
    getFluffyApiState,
    getClubConfigApiState,
    user,
    dispatch,
    getPrinterDetailsFromAsyncStorage,
    navigation
  ), [getFluffyApiState, getClubConfigApiState]);

  return (
    <View style={styles.container}>
      <CustomModalComponent
        isVisible={user.siteId === 0 && userIsSignedIn(user)}
        onClose={() => signOutUser(dispatch)}
        modalType="Form"
      >
        <EnterClubNbrForm
          onSubmit={clubNbr => {
            const updatedUser = { ...user, siteId: clubNbr };
            dispatch(loginUser(updatedUser));
            trackEvent('user_sign_in');
            if (user.countryCode !== 'US' && user.countryCode !== 'NOT_FOUND') {
              dispatch(getFluffyFeatures(updatedUser));
            }
          }}
          onSignOut={() => signOutUser(dispatch)}
        />
      </CustomModalComponent>
      <CustomModalComponent
        isVisible={
          user.siteId !== 0
          && (user.countryCode === 'US'
          || user.countryCode === 'NOT_FOUND')
          && userIsSignedIn(user)
        }
        onClose={() => signOutUser(dispatch)}
        modalType="Form"
      >
        <SelectCountryCodeModal
          onSignOut={() => signOutUser(dispatch)}
          onSubmitCN={() => {
            const updatedUser = { ...user, countryCode: 'CN' };
            dispatch(loginUser(updatedUser));
            dispatch(getFluffyFeatures(updatedUser));
          }}
          onSubmitMX={() => {
            const updatedUser = { ...user, countryCode: 'MX' };
            dispatch(loginUser(updatedUser));
            dispatch(getFluffyFeatures(updatedUser));
          }}
        />
      </CustomModalComponent>
      <View style={styles.buttonContainer}>
        <Button
          title={strings('GENERICS.SIGN_IN')}
          style={styles.signInButton}
          onPress={() => signInUser(dispatch)}
        />
      </View>
      <Text style={styles.versionDisplay}>
        { `${strings('GENERICS.VERSION')} ${pkg.version}${getBuildEnvironment()}` }
      </Text>
    </View>
  );
};

const Login = () => {
  const configUser = useTypedSelector(state => state.User);
  const getFluffyApiState = useTypedSelector(state => state.async.getFluffyRoles);
  const getClubConfigApiState = useTypedSelector(state => state.async.getClubConfig);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <LoginScreen
      user={configUser}
      dispatch={dispatch}
      getFluffyApiState={getFluffyApiState}
      getClubConfigApiState={getClubConfigApiState}
      navigation={navigation}
      useEffectHook={useEffect}
    />
  );
};
export default Login;
