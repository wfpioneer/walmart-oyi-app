import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ToolsButton from '../../components/toolsButton/ToolsButton';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './Tools.style';

interface ToolsScreenProps {
  navigation: NavigationProp<any>;
}

interface ToolsFeatures {
  key: string;
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
  }];

export const ToolsScreen = (props: ToolsScreenProps): JSX.Element => {
  const { navigation } = props;

  return (
    <View style={styles.mainContainer}>
      {tools.map(tool => (
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

  return (
    <ToolsScreen
      navigation={navigation}
    />
  );
};

export default Tools;
