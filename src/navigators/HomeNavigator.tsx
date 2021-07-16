/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import {
  Image, Platform, Text, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import ActionSheet from 'react-native-action-sheet';
// @ts-ignore
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

interface HomeNavigatorComponentProps {
  logoutUser: () => void;
  showActivityModal: () => void;
  hideActivityModal: () => void;
  navigation: Record<string, any>;
  isManualScanEnabled: boolean;
  setManualScan: (bool: boolean) => void;
  clubNbr: number;
}

const mapStateToProps = (state: any) => ({
  isManualScanEnabled: state.Global.isManualScanEnabled,
  clubNbr: state.User.siteId
});

const mapDispatchToProps = {
  logoutUser,
  showActivityModal,
  hideActivityModal,
  setManualScan
};

const Stack = createStackNavigator();

const showSignOutMenu = (props: HomeNavigatorComponentProps, navigation: any) => {
  const options = [
    strings('HOME.CHANGE_LANGUAGE'),
    strings('GENERICS.SIGN_OUT'),
    strings('GENERICS.CANCEL')
  ];

  const cancelButtonIndex = 2;
  ActionSheet.showActionSheetWithOptions({
    options,
    cancelButtonIndex
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
            trackEvent('change_language', { language: 'en' });
            return navigation.dispatch(StackActions.replace('Login'));
          case 1:
            setLanguage('es');
            trackEvent('change_language', { language: 'es' });
            return navigation.dispatch(StackActions.replace('Login'));
          case 2:
            setLanguage('zh');
            trackEvent('change_language', { language: 'zh' });
            return navigation.dispatch(StackActions.replace('Login'));
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
        if (Platform.OS === 'android') {
          props.hideActivityModal();
        }
      });
    }
  });
};

const renderHomeScanButton = (isManualScanEnabled: boolean, setManualScanFunc: (bool: boolean) => void) => (
  <TouchableOpacity onPress={() => {
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

const renderCamButton = () => (
  <TouchableOpacity onPress={() => { openCamera(); }}>
    <View style={styles.camButton}>
      <MaterialCommunityIcon name="camera" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

const renderHomeMenuButton = (props: HomeNavigatorComponentProps, navigation: any) => (
  <TouchableOpacity onPress={() => {
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

const renderHomeHeader = (props: HomeNavigatorComponentProps, navigation: any) => {
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
    headerMode="float"
    screenOptions={{
      headerStyle: { backgroundColor: COLOR.MAIN_THEME_COLOR },
      headerTintColor: COLOR.WHITE
    }}
  >
    <Stack.Screen
      name="Home"
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
    />
  </Stack.Navigator>
);

export const HomeNavigator = connect(mapStateToProps, mapDispatchToProps)(HomeNavigatorComponent);
