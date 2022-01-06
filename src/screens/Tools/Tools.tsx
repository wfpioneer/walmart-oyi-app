import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ToolsButton from '../../components/toolsButton/ToolsButton';
import { strings } from '../../locales';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import styles from './Tools.style';

interface ToolsScreenProps {
  navigation: NavigationProp<any>;
  userFeatures: string[];
}

interface ToolsFeatures {
  key: string; // This needs to align with features in Fluffy
  title: string; // This is the translation key to use
  destination: string;
  icon: ReactElement
}

// Add more objects to the array in the order they need to appear
const tools: ToolsFeatures[] = [
  {
    key: 'location management',
    title: 'LOCATION.LOCATION_MANAGEMENT',
    destination: 'LocationManagement',
    icon: <MaterialCommunityIcon
      name="map-marker-outline"
      size={28}
      color={COLOR.MAIN_THEME_COLOR}
    />
  },
  {
    key: 'pallet management',
    title: 'LOCATION.PALLET_MANAGEMENT',
    destination: 'PalletManagement',
    icon: <MaterialCommunityIcon
      name="cube-outline"
      size={28}
      color={COLOR.MAIN_THEME_COLOR}
    />
  }];

export const ToolsScreen = (props: ToolsScreenProps): JSX.Element => {
  const { navigation, userFeatures } = props;

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
  const userFeatures = useTypedSelector(state => state.User.features);

  return (
    <ToolsScreen
      navigation={navigation}
      userFeatures={userFeatures}
    />
  );
};

export default Tools;
