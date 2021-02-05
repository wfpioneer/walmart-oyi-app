import React from 'react';
import {
  GestureResponderEvent, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../themes/Color';
import styles from './FilterPillButton.style';

interface FilterPillButtonProps {
  filterText: string;
  onClosePress: (event: GestureResponderEvent) => void;
}

export const FilterPillButton = (props: FilterPillButtonProps) => (
  <View style={styles.container}>
    <Text style={styles.filterText}>
      { props.filterText }
    </Text>
    <TouchableOpacity onPress={props.onClosePress}>
      <MaterialCommunityIcons name="close-circle" size={20} color={COLOR.WHITE} />
    </TouchableOpacity>
  </View>
);
