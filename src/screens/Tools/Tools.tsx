import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import User from '../../models/User';
import ToolsButton from '../../components/toolsButton/ToolsButton';
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import styles from './Tools.style';

interface ToolsScreenProps {
  navigation: NavigationProp<any>;
  user: User;
}

interface ToolsFeatures {
  key: string; // This needs to align with features in Fluffy
  title: string; // This is the translation key to use
  destination: string;
  icon: ReactElement
}

const LOCATION_MANAGEMENT = 'location management';
const PALLET_MANAGEMENT = 'pallet management';
const SETTINGS_TOOL = 'settings tool';
const BINNING = 'binning';

// Add more objects to the array in the order they need to appear
const tools: ToolsFeatures[] = [
  {
    key: LOCATION_MANAGEMENT,
    title: 'LOCATION.LOCATION_MANAGEMENT',
    destination: 'LocationManagement',
    icon: <MaterialCommunityIcon
      name="map-marker-outline"
      size={28}
      color={COLOR.MAIN_THEME_COLOR}
    />
  },
  {
    key: PALLET_MANAGEMENT,
    title: 'LOCATION.PALLET_MANAGEMENT',
    destination: 'PalletManagement',
    icon: <MaterialCommunityIcon
      name="cube-outline"
      size={28}
      color={COLOR.MAIN_THEME_COLOR}
    />
  },
  {
    key: BINNING,
    title: 'BINNING.BINNING',
    destination: 'Binning',
    icon: <MaterialCommunityIcon
      name="login-variant"
      size={28}
      color={COLOR.MAIN_THEME_COLOR}
      style={{ transform: [{ rotate: '270deg' }] }}
    />
  },
  { // Should always be last in the list
    key: SETTINGS_TOOL,
    title: 'SETTINGS.TITLE',
    destination: 'SettingsTool',
    icon: <MaterialCommunityIcon
      name="cog-outline"
      size={28}
      color={COLOR.MAIN_THEME_COLOR}
    />
  }];

export const ToolsScreen = (props: ToolsScreenProps): JSX.Element => {
  const { navigation, user } = props;

  const userFeatures = [...user.features];
  if (user.configs.locationManagement && !userFeatures.includes(LOCATION_MANAGEMENT)) {
    userFeatures.push(LOCATION_MANAGEMENT);
  }
  if (user.configs.palletManagement && !userFeatures.includes(PALLET_MANAGEMENT)) {
    userFeatures.push(PALLET_MANAGEMENT);
  }
  if (user.configs.settingsTool && !userFeatures.includes(SETTINGS_TOOL)) {
    userFeatures.push(SETTINGS_TOOL);
  }
  if (user.configs.binning && !userFeatures.includes(BINNING)) {
    userFeatures.push(BINNING);
  }

  return (
    <View style={styles.mainContainer}>
      {/* Remove any tools which are not enabled for user/club,
      then map to ToolsButton component */}
      {tools.filter(tool => userFeatures.includes(tool.key))
        .map(tool => (
          <ToolsButton
            key={tool.key}
            title={strings(tool.title)}
            destination={tool.destination}
            navigation={navigation}
          >
            {tool.icon}
          </ToolsButton>
        ))}
    </View>
  );
};

const Tools = (): JSX.Element => {
  const navigation = useNavigation();
  const user = useTypedSelector(state => state.User);

  return (
    <ToolsScreen
      navigation={navigation}
      user={user}
    />
  );
};

export default Tools;
