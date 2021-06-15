import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './ToolsButton.style';

export interface ToolsButtonProps {
  title: string;
  destination: string;
  navigation: NavigationProp<any>;
  children: JSX.Element;
}

const ToolsButton = (props: ToolsButtonProps): JSX.Element => {
  const {
    title, destination, navigation, children
  } = props;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(destination)}
      activeOpacity={0.8}
      style={styles.button}
    >
      {children}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ToolsButton;
