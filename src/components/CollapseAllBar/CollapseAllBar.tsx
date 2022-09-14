import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import COLOR from '../../themes/Color';
import styles from './CollapseAllBar.style';
import { strings } from '../../locales';

interface CollapseAllBarProps {
  collapsed: boolean;
  onclick : React.Dispatch<React.SetStateAction<boolean>>;
}

const CollapseAllBar = ({ collapsed, onclick }: CollapseAllBarProps) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onclick(!collapsed)} testID="collapse-text-btn">
      <Text
        style={{
          color: COLOR.HAVELOCK_BLUE,
          fontSize: 12
        }}
      >
        {collapsed ? strings('AUDITS.EXPAND_ALL') : strings('AUDITS.COLLAPSE_ALL')}
      </Text>
    </TouchableOpacity>
  </View>
);

export default CollapseAllBar;
