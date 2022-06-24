import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLOR from '../../themes/Color';
import styles from './SortBar.style';

const SortBar = (isGrouped: boolean, updateGroupToggle: any) => (
  <View style={styles.viewSwitcher}>
    <TouchableOpacity onPress={() => updateGroupToggle(false)} testID="menu">
      <MaterialIcons
        name="menu"
        size={25}
        color={!isGrouped ? COLOR.BLACK : COLOR.GREY}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => updateGroupToggle(true)} testID="list">
      <MaterialIcons
        name="list"
        size={25}
        color={isGrouped ? COLOR.BLACK : COLOR.GREY}
      />
    </TouchableOpacity>
  </View>
);

export default SortBar;
