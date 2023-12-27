/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import {
  Image, Platform, Text, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import ActionSheet from 'react-native-action-sheet';
import { AuthorizeResult, logout } from 'react-native-app-auth';
import { StackActions } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import { Configurations } from '../models/User';
import Home from '../screens/Home/Home';
import Feedback from '../screens/Feedback/Feedback';
import COLOR from '../themes/Color';
import { getEnvironment } from '../utils/environment';
import styles from './HomeNavigator.style';
import { setLanguage, strings } from '../locales';
import { logoutUser } from '../state/actions/User';
import { hideActivityModal, showActivityModal } from '../state/actions/Modal';
import { setManualScan } from '../state/actions/Global';
import { trackEvent } from '../utils/AppCenterTool';
import { openCamera } from '../utils/scannerUtils';
import { Printer, PrinterType } from '../models/Printer';
import {
  savePrinter,
  setPriceLabelPrinter as setPriceLabelPrinterAsyncStorage
} from '../utils/asyncStorageUtils';
import {
  setPriceLabelPrinter,
  updatePrinterByID
} from '../state/actions/Print';

interface HomeNavigatorComponentProps {
  logoutUser: () => void;
  showActivityModal: () => void;
  hideActivityModal: () => void;
  navigation: Record<string, any>;
  isManualScanEnabled: boolean;
  setManualScan: (bool: boolean) => void;
  clubNbr: number;
  updatePrinterByID: (payload: any) => void;
  priceLabelPrinter: Printer;
  setPriceLabelPrinter: (payload: Printer) => void;
  userConfig: Configurations;
  userTokens: AuthorizeResult;
}

const mapStateToProps = (state: any) => ({
  isManualScanEnabled: state.Global.isManualScanEnabled,
  clubNbr: state.User.siteId,
  priceLabelPrinter: state.Print.priceLabelPrinter,
  userConfig: state.User.configs,
  userTokens: state.User.userTokens
});

const mapDispatchToProps = {
  logoutUser,
  showActivityModal,
  hideActivityModal,
  setManualScan,
  updatePrinterByID,
  setPriceLabelPrinter
};

const Stack = createStackNavigator();

const updateDefaultPrinter = (props: HomeNavigatorComponentProps) => {
  const defPrinter = {
    type: PrinterType.LASER,
    name: strings('PRINT.FRONT_DESK'),
    desc: strings('GENERICS.DEFAULT'),
    id: '000000000000',
    labelsAvailable: ['price']
  };
  props.updatePrinterByID({ id: '000000000000', printer: defPrinter });
  savePrinter(defPrinter);
  if (
    props.priceLabelPrinter
    && props.priceLabelPrinter.id === defPrinter.id
  ) {
    props.setPriceLabelPrinter(defPrinter);
    setPriceLabelPrinterAsyncStorage(defPrinter);
  }
};

const logoutPFUser = async (props: HomeNavigatorComponentProps) => {
  const urls = getEnvironment();
  const config = {
    issuer: urls.pingFedURL
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return logout(config, {
    idToken: props.userTokens.idToken,
    postLogoutRedirectUrl: 'com.walmart.intl.oyi://'
  });
};

const handleLanguageChange = (
  languageOptions: string[],
  showFeedback: boolean,
  props: HomeNavigatorComponentProps,
  navigation: any
// eslint-disable-next-line consistent-return
) => {
  ActionSheet.showActionSheetWithOptions(
    {
      options: languageOptions,
      // toggle cancel option index based on feedback config
      cancelButtonIndex: showFeedback ? 3 : 2
    },
    selectedLanguageIndex => {
      switch (selectedLanguageIndex) {
        case 0:
          setLanguage('en');
          updateDefaultPrinter(props);
          trackEvent('change_language', { language: 'en' });
          return navigation.dispatch(StackActions.replace('Tabs'));
        case 1:
          setLanguage('es');
          updateDefaultPrinter(props);
          trackEvent('change_language', { language: 'es' });
          return navigation.dispatch(StackActions.replace('Tabs'));
        case 2:
          setLanguage('zh');
          updateDefaultPrinter(props);
          trackEvent('change_language', { language: 'zh' });
          return navigation.dispatch(StackActions.replace('Tabs'));
        default:
          return null;
      }
    }
  );
};

const handleSignOut = async (
  props: HomeNavigatorComponentProps
) => {
  props.showActivityModal();
  trackEvent('user_sign_out', { lastPage: 'Home' });
  try {
    await logoutPFUser(props);
  } catch (error) {
    // Handle error (optional)
  }
  props.navigation.replace('Login');
  props.logoutUser();
  if (Platform.OS === 'android') {
    props.hideActivityModal();
  }
};

const handleFeedback = (
  props: HomeNavigatorComponentProps
) => {
  props.navigation.navigate('FeedbackScreen');
  trackEvent('feedback_screen', { lastPage: 'Home' });
};

export const showSignOutMenu = (
  props: HomeNavigatorComponentProps,
  navigation: any
) => {
  const options = [
    strings('HOME.CHANGE_LANGUAGE'),
    strings('GENERICS.SIGN_OUT'),
    strings('GENERICS.CANCEL')
  ];
  const { showFeedback } = props.userConfig;
  // to insert feedback into the menu before "Cancel"
  // option based on user config
  if (showFeedback) {
    options.splice(2, 0, strings('GENERICS.FEEDBACK'));
  }
  ActionSheet.showActionSheetWithOptions(
    {
      options,
      // toggle cancel option index based on feedback config
      cancelButtonIndex: showFeedback ? 3 : 2
    },
    // eslint-disable-next-line consistent-return
    buttonIndex => {
      const languageOptions = [
        'English',
        'Español',
        '汉语',
        strings('GENERICS.CANCEL')
      ];
      switch (buttonIndex) {
        case 0:
          handleLanguageChange(languageOptions, showFeedback, props, navigation);
          break;
        case 1:
          handleSignOut(props);
          break;
        case 2:
          handleFeedback(props);
          break;
        default:
          return null;
      }
    }
  );
};

export const renderHomeScanButton = (
  isManualScanEnabled: boolean,
  setManualScanFunc: (bool: boolean) => void
) => (
  <TouchableOpacity
    testID="btnScan"
    onPress={() => {
      if (isManualScanEnabled) {
        trackEvent('disable_manual_scan');
      } else {
        trackEvent('enable_manual_scan');
      }
      setManualScanFunc(!isManualScanEnabled);
    }}
  >
    <View style={styles.leftButton}>
      <MaterialCommunityIcon
        name="barcode-scan"
        size={20}
        color={COLOR.WHITE}
      />
    </View>
  </TouchableOpacity>
);

export const renderCamButton = () => (
  <TouchableOpacity
    testID="camerabtn"
    onPress={() => {
      openCamera();
    }}
  >
    <View style={styles.camButton}>
      <MaterialCommunityIcon name="camera" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const renderHomeMenuButton = (
  props: HomeNavigatorComponentProps,
  navigation: any
) => (
  <TouchableOpacity
    testID="btnShowMenu"
    onPress={() => {
      trackEvent('menu_button_click');
      showSignOutMenu(props, navigation);
    }}
  >
    <View style={styles.rightButton}>
      <Image
        style={styles.image}
        source={require('../assets/images/menu.png')}
      />
    </View>
  </TouchableOpacity>
);

export const renderPrintQueueButton = (navigation: any): React.JSX.Element => (
  <TouchableOpacity
    testID="print-queue-button"
    onPress={() => {
      trackEvent('print_queue_list_click');
      navigation.navigate('PrintPriceSign', { screen: 'PrintQueue' });
    }}
  >
    <View style={styles.printerButton}>
      <MaterialCommunityIcon name="printer" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const renderHomeHeader = (
  props: HomeNavigatorComponentProps,
  navigation: any
) => {
  const { isManualScanEnabled } = props;

  return (
    <View style={styles.headerContainer}>
      {Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage'
        ? renderCamButton()
        : null}
      {renderHomeScanButton(isManualScanEnabled, props.setManualScan)}
      {renderPrintQueueButton(navigation)}
      {renderHomeMenuButton(props, navigation)}
    </View>
  );
};

export const HomeNavigatorComponent = (
  props: HomeNavigatorComponentProps
): React.JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerMode: 'float',
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={Home}
      options={({ navigation }) => ({
        headerRight: () => renderHomeHeader(props, navigation),
        headerTitle: () => (
          <View>
            <Text style={styles.headerTitle}>
              {strings('HOME.OWN_YOUR_INVENTORY')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {`${strings('GENERICS.CLUB')} ${props.clubNbr}`}
            </Text>
          </View>
        )
      })}
      listeners={{
        blur: () => {
          if (props.isManualScanEnabled) {
            props.setManualScan(false);
          }
        }
      }}
    />
    <Stack.Screen
      name="FeedbackScreen"
      component={Feedback}
      options={() => ({
        headerTitle: () => (
          <View>
            <Text style={styles.headerTitle}>
              {strings('GENERICS.FEEDBACK')}
            </Text>
          </View>
        )
      })}
    />
  </Stack.Navigator>
);

export const HomeNavigator = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeNavigatorComponent);
