import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, {
  Dispatch, EffectCallback, useEffect
} from 'react';
import { useDispatch } from 'react-redux';
import {
  NativeModules, Text, View
} from 'react-native';
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

const userIsSignedIn = (user: User): boolean => user.sAMAccountName !== '' && user.userTokens.accessToken !== '';
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
    setUserId(userInfo.userPrincipalName);
    if (parseInt(userInfo['wm-BusinessUnitNumber'], 10)) {
      userInfo.siteId = parseInt(userInfo['wm-BusinessUnitNumber'], 10);
    }
    dispatch(loginUser(userInfo));
    trackEvent('user_sign_in');
    if (userInfo['wm-BusinessUnitCategory'] !== 'HO' && userInfo.c !== 'US') {
      dispatch(getFluffyFeatures({
        ...userInfo,
        siteId: parseInt(userInfo['wm-BusinessUnitNumber'], 10)
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
  if (user.c !== 'US') {
    dispatch(getFluffyFeatures(updatedUser));
  }
};

export const onSubmitCountryCode = (countryCode: string, dispatch: Dispatch<any>, user: User) => {
  const updatedUser = { ...user, c: countryCode, countryCode };
  dispatch(loginUser(updatedUser));
  if (updatedUser['wm-BusinessUnitCategory'] !== 'HO') {
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
    useEffectHook
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
        isVisible={user['wm-BusinessUnitCategory'] === 'HO' && user.c !== 'US' && userIsSignedIn(user)}
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
          user.c === 'US'
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
          onPress={() => signInUserInit()}
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
