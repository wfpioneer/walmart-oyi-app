import React, { ReactElement } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ToolsButton from '../../components/toolsButton/ToolsButton';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './Tools.style';

interface ToolsProps {
}

interface ToolsFeatures {
  key: string;
  title: string;
  destination: string;
  icon: ReactElement
}

export const ToolsScreen = (props: ToolsProps): JSX.Element => {
  // Add more objects to the array in the order they need to appear
  const tools: ToolsFeatures[] = [
    {
      key: 'location management',
      title: strings('LOCATION.LOCATION_MANAGEMENT'),
      destination: '',
      icon: <MaterialCommunityIcon
        name="map-marker-outline"
        size={28}
        color={COLOR.MAIN_THEME_COLOR}
      />
    }];

  return (
    <View style={styles.mainContainer}>
      {tools.map(tool => (
        <ToolsButton
          key={tool.key}
          title={tool.title}
          destination={tool.destination}
        >
          {tool.icon}
        </ToolsButton>
      ))}
    </View>
  );
};

const Tools = (): JSX.Element => (
  <ToolsScreen />
);

export default Tools;
