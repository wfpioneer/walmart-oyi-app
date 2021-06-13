import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './ToolsButton.style';

interface ToolsButtonProps {
  title: string;
  destination: string;
  children: JSX.Element
}

const ToolsButton = (props: ToolsButtonProps): JSX.Element => {
  const { title, destination, children } = props;
  const navigation = useNavigation();

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
