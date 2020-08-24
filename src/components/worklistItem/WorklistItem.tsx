import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './WorklistItem.style';
import {strings} from "../../locales";

interface WorklistItemProps {
  exceptionType: string;
  itemDescription: string;
  itemNumber: number;
}

const exceptionTypeToDisplayString = (exceptionType: string) => {
  switch (exceptionType) {
    case 'po':
      return strings('EXCEPTION.PRICE_OVERRIDE');
    default:
      return strings('GENERICS.ERROR');
  }
}

export const WorklistItem = (props: WorklistItemProps) => {
  return (
    <View style={ styles.container }>
      <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.image} />
      <View style={ styles.content }>
        <Text style={ styles.exceptionType }>
          { exceptionTypeToDisplayString(props.exceptionType) }
        </Text>
        <Text style={ styles.itemInfo }>
          { props.itemDescription }
        </Text>
        <Text style={ styles.itemNumber }>
          { props.itemNumber }
        </Text>
      </View>
    </View>
  );
};
