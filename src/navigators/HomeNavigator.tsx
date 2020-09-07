import React from 'react';
import {
  Image, Platform, Text, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import ActionSheet from 'react-native-action-sheet';
// @ts-ignore
import WMSSO from 'react-native-wmsso';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../screens/Home/Home';
import COLOR from '../themes/Color';
import styles from './HomeNavigator.style';
import { setLanguage, strings } from '../locales';
import { logoutUser } from '../state/actions/User';
import { hideModal, showModal } from '../state/actions/ActivityModal';
import StyleGuide from '../screens/StyleGuide/StyleGuide';
import { setManualScan } from '../state/actions/Global';

interface HomeNavigatorComponentProps {
  logoutUser: Function;
  showModal: Function;
  hideModal: Function;
  navigation: Record<string, any>;
  isManualScanEnabled: boolean;
  setManualScan: Function;
  clubNbr: number;
}

const mapStateToProps = (state: any) => ({
  isManualScanEnabled: state.Global.isManualScanEnabled,
  clubNbr: state.User.siteId
});

const mapDispatchToProps = {
  logoutUser,
  showModal,
  hideModal,
  setManualScan
};

const Stack = createStackNavigator();

const showSignOutMenu = (props: HomeNavigatorComponentProps, forceUpdateFunc: Function) => {
  const options = [
    strings('HOME.CHANGE_LANGUAGE'),
    strings('GENERICS.SIGN_OUT'),
    strings('GENERICS.CANCEL')
  ];

  if (__DEV__) {
    options.splice(2, 0, strings('HOME.STYLE_GUIDE'));
  }

  const cancelButtonIndex = __DEV__ ? 3 : 2;
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
            return forceUpdateFunc();
          case 1:
            setLanguage('es');
            return forceUpdateFunc();
          case 2:
            setLanguage('zh');
            return forceUpdateFunc();
          default:
            return null;
        }
      });
    }
    if (buttonIndex === 1) {
      props.showModal();
      WMSSO.signOutUser().then(() => {
        props.navigation.replace('Login');
        props.logoutUser();
        if (Platform.OS === 'android') {
          props.hideModal();
        }
      });
      return;
    }

    if (buttonIndex === 2 && cancelButtonIndex !== 2) {
      props.navigation.navigate('Style Guide');
    }
  });
};

const renderHomeScanButton = (isManualScanEnabled: boolean, setManualScanFunc: Function) => (
  <TouchableOpacity onPress={() => { setManualScanFunc(!isManualScanEnabled); }}>
    <View style={styles.leftButton}>
      <MaterialCommunityIcon name="barcode-scan" size={20} color={COLOR.WHITE} />
    </View>
  </TouchableOpacity>
);

const renderHomeMenuButton = (props: HomeNavigatorComponentProps, forceUpdateFunc: Function) => (
  <TouchableOpacity onPress={() => showSignOutMenu(props, forceUpdateFunc)}>
    <View style={styles.rightButton}>
      <Image
        style={styles.image}
        source={require('../assets/images/menu.png')}
      />
    </View>
  </TouchableOpacity>
);

const onStyleGuideMenuButtonPress = (navigation: any, route: any) => {
  const menuOpenParam = route.params.menuOpen;
  navigation.setParams({ menuOpen: !menuOpenParam });
};

const renderStyleGuideMenuButton = (navigation: any, route: any) => (
  <TouchableOpacity onPress={() => onStyleGuideMenuButtonPress(navigation, route)}>
    <View style={styles.rightButton}>
      <Image
        style={styles.image}
        source={require('../assets/images/hamburger.png')}
      />
    </View>
  </TouchableOpacity>
);

const renderHomeHeader = (props: HomeNavigatorComponentProps, forceUpdateFunc: Function) => {
  const { isManualScanEnabled } = props;

  return (
    <View style={styles.headerContainer}>
      {renderHomeScanButton(isManualScanEnabled, props.setManualScan)}
      {renderHomeMenuButton(props, forceUpdateFunc)}
    </View>
  );
};

export const HomeNavigatorComponent = (props: HomeNavigatorComponentProps) => {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  return (
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
        options={{
          headerRight: () => renderHomeHeader(props, forceUpdate),
          headerTitle: () => (
            <View>
              <Text style={styles.headerTitle}>{strings('HOME.OWN_YOUR_INVENTORY')}</Text>
              <Text style={styles.headerSubtitle}>{`${strings('GENERICS.CLUB')} ${props.clubNbr}`}</Text>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="Style Guide"
        component={StyleGuide}
        options={({ navigation, route }) => ({
          headerRight: () => renderStyleGuideMenuButton(navigation, route)
        })}
        initialParams={{ scrollIndex: 0, menuOpen: false }}
      />
    </Stack.Navigator>
  );
};

export const HomeNavigator = connect(mapStateToProps, mapDispatchToProps)(HomeNavigatorComponent);
