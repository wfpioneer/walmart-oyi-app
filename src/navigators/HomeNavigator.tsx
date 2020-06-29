import React from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import ActionSheet from 'react-native-action-sheet';
// @ts-ignore
import WMSSO from 'react-native-wmsso';
import {
  Image, Platform, TouchableOpacity, View
} from 'react-native';
import Home from '../screens/Home/Home';
import COLOR from '../themes/Color';
import styles from './HomeNavigator.style';
import { strings } from '../locales';
import { logoutUser } from '../state/actions/User';
import { hideModal, showModal } from '../state/actions/ActivityModal';
import StyleGuide from '../screens/StyleGuide/StyleGuide';

interface HomeNavigatorComponentProps {
  logoutUser: Function;
  showModal: Function;
  hideModal: Function;
  navigation: Record<string, any>;
}

const mapDispatchToProps = {
  logoutUser,
  showModal,
  hideModal
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
      props.showModal();
      WMSSO.signOutUser().then(() => {
        props.navigation.navigate('Login');
        props.logoutUser();
        if (Platform.OS === 'android') {
          props.hideModal();
        }
      });
      return;
    }

    if (buttonIndex === 1 && cancelButtonIndex !== 1) {
      props.navigation.navigate('Style Guide');
    }
  });
};

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

export const HomeNavigatorComponent = (props: HomeNavigatorComponentProps) => (
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
        headerRight: () => renderHomeMenuButton(props)
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

export const HomeNavigator = connect(null, mapDispatchToProps)(HomeNavigatorComponent);
