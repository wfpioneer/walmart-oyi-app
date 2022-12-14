import React from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Dispatch } from 'redux';
import styles from './WorklistItem.style';
import { setScannedEvent } from '../../state/actions/Global';
import { trackEvent } from '../../utils/AppCenterTool';
import { exceptionTypeToDisplayString } from '../../screens/Worklist/FullExceptionList';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

interface WorklistItemProps {
  exceptionType: string;
  itemDescription: string;
  itemNumber: number;
  upcNbr: string;
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
  countryCode: string;
  showItemImage: boolean;
}

export const WorklistItem = (props: WorklistItemProps): JSX.Element => {
  const {
    navigation, dispatch, exceptionType, itemDescription, itemNumber, upcNbr, countryCode, showItemImage
  } = props;
  const worklistItemOnPress = () => {
    trackEvent('worklist_item_click', {
      upc: upcNbr,
      itemNbr: itemNumber,
      itemDescription
    });
    dispatch(setScannedEvent({ type: 'worklist', value: itemNumber.toString() }));
    navigation.navigate('ReviewItemDetails', { screen: 'ReviewItemDetailsHome' });
  };

  return (
    <TouchableOpacity testID="btnCard" style={styles.container} onPress={worklistItemOnPress}>
      {showItemImage && (
      <ImageWrapper
        itemNumber={itemNumber}
        countryCode={countryCode}
        imageStyle={styles.image}
      />
      )}
      <View style={styles.content}>
        <Text style={styles.exceptionType}>
          { exceptionTypeToDisplayString(exceptionType) }
        </Text>
        <Text style={styles.itemInfo}>
          { itemDescription }
        </Text>
        <Text style={styles.itemNumber}>
          { itemNumber }
        </Text>
      </View>
    </TouchableOpacity>
  );
};
