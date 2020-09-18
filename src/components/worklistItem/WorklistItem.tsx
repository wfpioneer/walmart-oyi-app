import React from 'react';
import {
  Image, Text, TouchableOpacity, View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import styles from './WorklistItem.style';
import { strings } from '../../locales';
import { setScannedEvent } from '../../state/actions/Global';

interface WorklistItemProps {
  exceptionType: string;
  itemDescription: string;
  itemNumber: number;
  upcNbr: string;
}

const exceptionTypeToDisplayString = (exceptionType: string) => {
  switch (exceptionType) {
    case 'po':
      return strings('EXCEPTION.PRICE_OVERRIDE');
    default:
      return strings('GENERICS.ERROR');
  }
};

export const WorklistItem = (props: WorklistItemProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const worklistItemOnPress = () => {
    dispatch(setScannedEvent({ type: 'worklist', value: props.upcNbr }));
    navigation.navigate('ReviewItemDetails');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={worklistItemOnPress}>
      <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.exceptionType}>
          { exceptionTypeToDisplayString(props.exceptionType) }
        </Text>
        <Text style={styles.itemInfo}>
          { props.itemDescription }
        </Text>
        <Text style={styles.itemNumber}>
          { props.itemNumber }
        </Text>
      </View>
    </TouchableOpacity>
  );
};
