import React from 'react';
import { Text, View } from 'react-native';
import styles from './Tools.style';

interface ToolsProps {
}

export const ToolsScreen = (props: ToolsProps): JSX.Element => {
  const tools = ['location management'];

  return (
    <View>
      <Text>TEMP</Text>
    </View>
  );
};

const Tools = (): JSX.Element => {

  return (
    <ToolsScreen />
  );
};

export default Tools;
