/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import {
  Image, Platform, Text, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import ActionSheet from 'react-native-action-sheet';
// @ts-expect-error wmsso exists as an imported dependency
import WMSSO from 'react-native-wmsso';
import { StackActions } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import Home from '../screens/Home/Home';
import COLOR from '../themes/Color';
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
import { resetPrintQueue, setPriceLabelPrinter, updatePrinterByID } from '../state/actions/Print';

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
  resetPrintQueue: () => void;
}

const mapStateToProps = (state: any) => ({
  isManualScanEnabled: state.Global.isManualScanEnabled,
  clubNbr: state.User.siteId,
  priceLabelPrinter: state.Print.priceLabelPrinter
});

const mapDispatchToProps = {
  logoutUser,
  showActivityModal,
  hideActivityModal,
  setManualScan,
  updatePrinterByID,
  setPriceLabelPrinter,
  resetPrintQueue
};

const Stack = createStackNavigator();

export const showSignOutMenu = (props: HomeNavigatorComponentProps, navigation: any) => {
  const options = [
    strings('HOME.CHANGE_LANGUAGE'),
    strings('GENERICS.SIGN_OUT'),
    strings('GENERICS.CANCEL')
  ];

  const updateDefaultPrinter = () => {
    const defPrinter = {
      type: PrinterType.LASER,
      name: strings('PRINT.FRONT_DESK'),
      desc: strings('GENERICS.DEFAULT'),
      id: '000000000000',
      labelsAvailable: ['price']
    };
    props.updatePrinterByID({ id: '000000000000', printer: defPrinter });
    savePrinter(defPrinter);
    if (props.priceLabelPrinter && props.priceLabelPrinter.id === defPrinter.id) {
      props.setPriceLabelPrinter(defPrinter);
      setPriceLabelPrinterAsyncStorage(defPrinter);
    }
  };

  ActionSheet.showActionSheetWithOptions({
    options,
    cancelButtonIndex: 2
  },
  buttonIndex => {
    if (buttonIndex === 0) {
      const languageOptions = [
        'English',
        'Español',
        '汉语',
        strings('GENERICS.CANCEL')
      ];
      ActionSheet.showActionSheetWithOptions({
        options: languageOptions,
        cancelButtonIndex: 3
      }, selectedLanguageIndex => {
        switch (selectedLanguageIndex) {
          case 0:
            setLanguage('en');
            updateDefaultPrinter();
            trackEvent('change_language', { language: 'en' });
            return navigation.dispatch(StackActions.replace('Tabs'));
          case 1:
            setLanguage('es');
            updateDefaultPrinter();
            trackEvent('change_language', { language: 'es' });
            return navigation.dispatch(StackActions.replace('Tabs'));
          case 2:
            setLanguage('zh');
            updateDefaultPrinter();
            trackEvent('change_language', { language: 'zh' });
            return navigation.dispatch(StackActions.replace('Tabs'));
          default:
            return null;
        }
      });
    }
    if (buttonIndex === 1) {
      props.showActivityModal();
      trackEvent('user_sign_out', { lastPage: 'Home' });
      WMSSO.signOutUser().then(() => {
        props.navigation.replace('Login');
        props.logoutUser();
        props.resetPrintQueue();
        if (Platform.OS === 'android') {
          props.hideActivityModal();
        }
      });
    }
  });
};

export const renderHomeScanButton = (isManualScanEnabled: boolean, setManualScanFunc: (bool: boolean) => void) => (
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
      <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const renderCamButton = () => (
  <TouchableOpacity onPress={() => { openCamera(); }}>
    <View style={styles.camButton}>
      <MaterialCommunityIcon name="camera" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

export const renderHomeMenuButton = (props: HomeNavigatorComponentProps, navigation: any) => (
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

export const renderHomeHeader = (props: HomeNavigatorComponentProps, navigation: any) => {
  const { isManualScanEnabled } = props;

  return (
    <View style={styles.headerContainer}>
      {Config.ENVIRONMENT === 'dev' || Config.ENVIRONMENT === 'stage' ? renderCamButton() : null}
      {renderHomeScanButton(isManualScanEnabled, props.setManualScan)}
      {renderHomeMenuButton(props, navigation)}
    </View>
  );
};

export const HomeNavigatorComponent = (props: HomeNavigatorComponentProps): JSX.Element => (
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
            <Text style={styles.headerTitle}>{strings('HOME.OWN_YOUR_INVENTORY')}</Text>
            <Text style={styles.headerSubtitle}>{`${strings('GENERICS.CLUB')} ${props.clubNbr}`}</Text>
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
  </Stack.Navigator>
);

export const HomeNavigator = connect(mapStateToProps, mapDispatchToProps)(HomeNavigatorComponent);
