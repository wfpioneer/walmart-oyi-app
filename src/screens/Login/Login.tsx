import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, {
  Dispatch, EffectCallback, useEffect
} from 'react';
import { useDispatch } from 'react-redux';
import {
  NativeModules, Text, View
} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AuthorizeResult, authorize, logout } from 'react-native-app-auth';
import { Printer, PrinterType } from '../../models/Printer';
import Button, { ButtonType } from '../../components/buttons/Button';
import EnterClubNbrForm from '../../components/EnterClubNbrForm/EnterClubNbrForm';
import styles from './Login.style';
import {
  assignFluffyFeatures, loginUser, logoutUser, setConfigs, setUserTokens
} from '../../state/actions/User';
import { GET_CLUB_CONFIG, GET_FLUFFY_ROLES } from '../../state/actions/asyncAPI';
import {
  getClubConfig, getFluffyFeatures, getItemCenterToken, updateUserConfig
} from '../../state/actions/saga';
import User from '../../models/User';
import { setLanguage, strings } from '../../locales';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setUserId, trackEvent } from '../../utils/AppCenterTool';
import { sessionEnd } from '../../utils/sessionTimeout';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { CustomModalComponent, ModalCloseIcon } from '../Modal/Modal';
import {
  Environment, getBuildEnvironment, getEnvironment, getPingFedClientId
} from '../../utils/environment';
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

export const resetClubConfigApiState = () => ({ type: GET_CLUB_CONFIG.RESET });
export const resetFluffyFeaturesApiState = () => ({ type: GET_FLUFFY_ROLES.RESET });
const DOMAIN = 'wm-BusinessUnitType';
const CLUB_NBR = 'wm-BusinessUnitNumber';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');

// Since CN Associate JobCodes are inconsistent, this set of roles will be added
// to all successful fluffy responses for CN
// If we encounter future scenarios, we can modify this set of Associate roles
// NOTE: This is only a stop-gap until a better solution is found
const CN_ASSOCIATE_ROLES = ['on hands change'];

// This method merges our hard-coded Associate roles with our fluffy response
export const addCNAssociateRoleOverrides = (
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
  activityModalShown: boolean
}

export const getSystemLanguage = (): string => {
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

const extractUserId = (fullUserId: string) => {
  const userArray = fullUserId.split('.');
  return userArray[0];
};

const userIsSignedIn = (user: User): boolean => user.sAMAccountName !== '' && user.userTokens.accessToken !== '';

/**
 * This method is here so that we can determine if a US user has set the country code for the app's use.
 * Our app does not work for US country, but our developers have US logins and so the country code will need
 * to be set manually.  If not US, then the user will already have the correct country
 *
 * @param c comes from the pingfed user's c value, which designates the country
 * @param countryCode comes from the pingfed user's countryCode value, which appears to numerically designate
 * the country.  For our app's purposes, we use this field instead of c
 * @returns t/f whether the country code has been set for a US user
 */
export const isCountryCodeSet = (c: string, countryCode: string) => (c === 'US' || c === 'NOT_FOUND'
  ? !countryCode.match(/[^A-Za-z]/) && countryCode !== c : true);

export const SelectCountryCodeModal = (
  props: {
    onSignOut: () => void,
    onSubmitMX:() => void,
    onSubmitCN: () => void
  }
) => {
  const { onSignOut, onSubmitCN, onSubmitMX } = props;
  return (
    <View style={styles.modalContainer}>
      <View style={styles.closeContainer}>
        <IconButton
          testID="closeButton"
          icon={ModalCloseIcon}
          type={IconButtonType.NO_BORDER}
          onPress={() => onSignOut()}
          style={styles.closeButton}
        />
      </View>
      <Text style={styles.titleText}>
        Please select a country to sign into
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <Button
            testID="mxButton"
            title="MX"
            onPress={() => onSubmitMX()}
            type={ButtonType.SOLID_WHITE}
            titleColor={COLOR.MAIN_THEME_COLOR}
            style={styles.affirmButton}
          />
          <Button
            testID="cnButton"
            title="CN"
            onPress={() => onSubmitCN()}
            type={ButtonType.PRIMARY}
            style={styles.affirmButton}
          />
        </View>
      </View>
    </View>
  );
};

export const signInUser = async (dispatch: Dispatch<any>): Promise<void> => {
  try {
    dispatch(showActivityModal());
    const urls : Environment = getEnvironment();
    const config = {
      issuer: urls.pingFedURL,
      clientId: getPingFedClientId(),
      redirectUrl: 'com.samsclub.intl.oyi://oauth',
      scopes: ['openid full']
    };

    const userTokens: AuthorizeResult = await authorize(config);
    dispatch(setUserTokens(userTokens));
    const userInfoResponse = await fetch(`${urls.pingFedURL}/idp/userinfo.openid`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userTokens.accessToken}`
      }
    });
    const userInfo = await userInfoResponse.json();

    dispatch(hideActivityModal());

    setLanguage(getSystemLanguage());
    userInfo.userId = extractUserId(userInfo.sAMAccountName || '');
    setUserId(userInfo.userPrincipalName);
    if (userInfo[DOMAIN] === 'NOT_FOUND' && userInfo[CLUB_NBR] === 'NOT_FOUND') {
      userInfo[DOMAIN] = 'HO';
    }

    if (parseInt(userInfo[CLUB_NBR], 10)) {
      userInfo.siteId = parseInt(userInfo[CLUB_NBR], 10);
    }
    userInfo.countryCode = userInfo.c; // setting country code to c
    dispatch(loginUser({ ...userInfo }));
    trackEvent('user_sign_in');
    if (userInfo[DOMAIN] !== 'HO' && userInfo.c !== 'US') {
      dispatch(getFluffyFeatures({
        ...userInfo,
        siteId: parseInt(userInfo[CLUB_NBR], 10)
      }));
    }

    return Promise.resolve();
  } catch (e: any) {
    dispatch(hideActivityModal());
    return Promise.reject(e);
  }
};

export const signOutUser = async (dispatch: Dispatch<any>, user: User): Promise<void> => {
  dispatch(showActivityModal());
  const urls = getEnvironment();
  trackEvent('user_sign_out', { lastPage: 'Login' });
  const config = {
    issuer: urls.pingFedURL
  };
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await logout(config, {
      idToken: user.userTokens.idToken,
      postLogoutRedirectUrl: 'com.walmart.intl.oyi://'
    });
    dispatch(hideActivityModal());
    dispatch(logoutUser());
  } catch {
    dispatch(hideActivityModal());
    dispatch(logoutUser());
  }
};

export const userConfigsApiHook = (
  getFluffyApiState: AsyncState,
  getClubConfigApiState: AsyncState,
  user: User,
  dispatch: Dispatch<any>,
  getPrinterDetailsFromAsyncStorage: (dispatchAction: Dispatch<any>) => Promise<void>,
  navigation: NavigationProp<any>,
  env: string
) => {
  const userCountryCode = user.countryCode.toUpperCase();
  if (getFluffyApiState.isWaiting || getClubConfigApiState.isWaiting) {
    dispatch(showActivityModal());
  }
  if (!getFluffyApiState.isWaiting && getFluffyApiState.result) {
    if (getFluffyApiState.result.status === 200) {
      const fluffyResultData = getFluffyApiState.result.data;
      const fluffyFeatures = userCountryCode === 'CN' ? addCNAssociateRoleOverrides(fluffyResultData)
        : fluffyResultData;
      dispatch(assignFluffyFeatures(fluffyFeatures));
    }
    dispatch(resetFluffyFeaturesApiState());
    dispatch(getClubConfig());
    if (userCountryCode === 'CN') {
      dispatch(getItemCenterToken());
    }
    dispatch(updateUserConfig());
  } else if (getFluffyApiState.error) {
    // TODO Display toast/popup letting user know roles could not be retrieved
    // TODO remove mocked response once app is onboarded to dev fluffy in service registry
    const mockFluffyResponse = [
      'manager approval',
      'location management',
      'on hands change',
      'location management edit',
      'location printing'
    ];
    if (env === '-DEV') {
      dispatch(assignFluffyFeatures(mockFluffyResponse));
    }
    dispatch(getClubConfig());
    if (userCountryCode === 'CN') {
      dispatch(getItemCenterToken());
    }
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

export const onSubmitClubNbr = (clubNbr: number, dispatch: Dispatch<any>, user: User) => {
  const updatedUser = { ...user, 'wm-BusinessUnitNumber': clubNbr.toString(), siteId: clubNbr };
  dispatch(loginUser(updatedUser));
  trackEvent('user_sign_in');
  console.log(updatedUser);
  if (isCountryCodeSet(user.c, user.countryCode)) {
    dispatch(getFluffyFeatures(updatedUser));
  }
};

export const onSubmitCountryCode = (countryCode: string, dispatch: Dispatch<any>, user: User) => {
  const updatedUser = { ...user, countryCode };
  dispatch(loginUser(updatedUser));
  if (updatedUser[DOMAIN] !== 'HO') {
    dispatch(getFluffyFeatures(updatedUser));
  }
};

export const LoginScreen = (props: LoginScreenProps) => {
  const {
    user,
    getFluffyApiState,
    getClubConfigApiState,
    navigation,
    dispatch,
    useEffectHook,
    activityModalShown
  } = props;

  const signInUserInit = () => {
    signInUser(dispatch).then(() => {
    }).catch((e: Error) => {
      console.warn(e.message);
    });
  };

  useEffectHook(() => {
    signInUserInit();

    navigation.addListener('blur', () => {
      dispatch(resetClubConfigApiState());
    });

    return () => {
      navigation.removeListener('blur', () => {});
    };
  }, [navigation]);

  useEffectHook(() => userConfigsApiHook(
    getFluffyApiState,
    getClubConfigApiState,
    user,
    dispatch,
    getPrinterDetailsFromAsyncStorage,
    navigation,
    getBuildEnvironment()
  ), [getFluffyApiState, getClubConfigApiState]);

  return (
    <View style={styles.container}>
      <CustomModalComponent
        isVisible={navigation.isFocused() && !activityModalShown
          && user[DOMAIN] === 'HO' && isCountryCodeSet(user.c, user.countryCode) && userIsSignedIn(user)}
        onClose={() => null}
        modalType="Form"
      >
        <EnterClubNbrForm
          onSubmit={clubNbr => onSubmitClubNbr(clubNbr, dispatch, user)}
          onSignOut={() => signOutUser(dispatch, user)}
        />
      </CustomModalComponent>
      <CustomModalComponent
        isVisible={
          !isCountryCodeSet(user.c, user.countryCode)
          && userIsSignedIn(user)
        }
        onClose={() => signOutUser(dispatch, user)}
        modalType="Form"
      >
        <SelectCountryCodeModal
          onSignOut={() => signOutUser(dispatch, user)}
          onSubmitCN={() => onSubmitCountryCode('CN', dispatch, user)}
          onSubmitMX={() => onSubmitCountryCode('MX', dispatch, user)}
        />
      </CustomModalComponent>
      <View style={styles.buttonContainer}>
        <Button
          title={strings('GENERICS.SIGN_IN')}
          style={styles.signInButton}
          onPress={() => signOutUser(dispatch, user).then(() => signInUserInit())}
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
  const { showActivity } = useTypedSelector(state => state.modal);

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
      activityModalShown={showActivity}
    />
  );
};
export default Login;
