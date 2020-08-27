import React from 'react';
import { Text } from 'react-native';
import { connect } from "react-redux";
import { createStackNavigator } from '@react-navigation/stack';
import ActionSheet from 'react-native-action-sheet';
// @ts-ignore
import WMSSO from 'react-native-wmsso';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import Home from '../screens/Home/Home';
import COLOR from '../themes/Color';
import styles from './HomeNavigator.style';
import { strings } from '../locales';
import { logoutUser } from '../state/actions/User';
import { hideActivityModal, showActivityModal } from '../state/actions/Modal';
import StyleGuide from '../screens/StyleGuide/StyleGuide';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setManualScan } from '../state/actions/Global';

interface HomeNavigatorComponentProps {
  logoutUser: Function;
  showActivityModal: Function;
  hideActivityModal: Function;
  navigation: Record<string, any>;
  isManualScanEnabled: boolean;
  setManualScan: Function;
  clubNbr: number;
}

const mapStateToProps = (state: any) => {
  return {
    isManualScanEnabled: state.Global.isManualScanEnabled,
    clubNbr: state.User.siteId
  }
}

const mapDispatchToProps = {
  logoutUser,
  showActivityModal,
  hideActivityModal,
  setManualScan
};

const Stack = createStackNavigator();

const showSignOutMenu = (props: HomeNavigatorComponentProps) => {
  const options = [
    strings('GENERICS.SIGN_OUT'),
    strings('GENERICS.CANCEL')
  ];

  if (__DEV__) {
    options.splice(1, 0, strings('HOME.STYLE_GUIDE'));
  }

  const cancelButtonIndex = __DEV__ ? 2 : 1;
  ActionSheet.showActionSheetWithOptions({
    options,
    cancelButtonIndex
  },
  buttonIndex => {
    if (buttonIndex === 0) {
      props.showActivityModal();
      WMSSO.signOutUser().then(() => {
        props.navigation.replace('Login');
        props.logoutUser();
        if (Platform.OS === 'android') {
          props.hideActivityModal();
        }
      });
      return;
    }

    if (buttonIndex === 1 && cancelButtonIndex !== 1) {
      props.navigation.navigate('Style Guide');
    }
  });
};

const renderHomeHeader = (props: HomeNavigatorComponentProps) => {
  const { isManualScanEnabled, setManualScan } = props;

  return (
    <View style={styles.headerContainer}>
      {renderHomeScanButton(isManualScanEnabled, setManualScan)}
      {renderHomeMenuButton(props)}
    </View>
  )
}

const renderHomeScanButton = (isManualScanEnabled: boolean, setManualScan: Function) => {
  return (
    <TouchableOpacity onPress={() => {setManualScan(!isManualScanEnabled)}}>
      <View style={styles.leftButton}>
        <MaterialCommunityIcon name={'barcode-scan'} size={20} color={COLOR.WHITE} />
      </View>
    </TouchableOpacity>
  );
}

const renderHomeMenuButton = (props: HomeNavigatorComponentProps) => (
  <TouchableOpacity onPress={() => showSignOutMenu(props)}>
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

export const HomeNavigatorComponent = (props: HomeNavigatorComponentProps) => {
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
          headerRight: () => renderHomeHeader(props),
          headerTitle: () => {
            return (
              <View>
                <Text style={styles.headerTitle}>{strings('HOME.OWN_YOUR_INVENTORY')}</Text>
                <Text style={styles.headerSubtitle}>{`${strings('GENERICS.CLUB')} ${props.clubNbr}`}</Text>
              </View>
            );
          }
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
}

export const HomeNavigator = connect(mapStateToProps, mapDispatchToProps)(HomeNavigatorComponent);
