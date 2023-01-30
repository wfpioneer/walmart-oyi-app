import React from 'react';
import { Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLOR from '../../themes/Color';
import styles from './FilterMenuCard.style';

interface MenuCardProps {
    title: string;
    subtext: string;
    opened: boolean;
  }

export const MenuCard = (props: MenuCardProps): JSX.Element => {
  const iconName = props.opened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
  return (
    <>
      <View style={styles.menuCardText}>
        <Text>{props.title}</Text>
        <Text style={styles.subtitleText}>{props.subtext}</Text>
      </View>
      <View style={styles.arrowView}>
        <MaterialIcons name={iconName} size={25} color={COLOR.GREY_700} />
      </View>
    </>
  );
};
