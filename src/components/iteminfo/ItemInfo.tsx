import React from 'react';
import { Image, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './ItemInfo.style';
import { currencies, strings } from '../../locales';
import Button from '../buttons/Button';
import COLOR from '../../themes/Color';

type ItemInfoProps = {
  image?: any;
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  status: string;
  category: string;
  price: number;
  exceptionType?: string; // This is enumerated
}

const ItemInfo = (props: ItemInfoProps) => {
  const {
    itemName, itemNbr, upcNbr, status, category, price, exceptionType
  } = props;
  const navigation = useNavigation();

  const handlePrintPriceSign = () => {
    navigation.navigate('PrintPriceSign', { screen: 'PrintPriceSignScreen' });
  };

  let exceptionString = strings('EXCEPTION.UNKNOWN');
  if (exceptionType) {
    switch (exceptionType.toUpperCase()) {
      case 'NO':
        exceptionString = strings('EXCEPTION.NEGATIVE_ON_HANDS');
        break;
      case 'NSFL':
        exceptionString = strings('EXCEPTION.UNKNOWN');
        break;
      case 'NP':
        exceptionString = strings('EXCEPTION.NIL_PICK');
        break;
      case 'NS':
        exceptionString = strings('EXCEPTION.NO_SALES');
        break;
      case 'C':
        exceptionString = strings('EXCEPTION.CANCELLED');
        break;
      case 'PO':
        exceptionString = strings('EXCEPTION.PO');
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.image} />
      </View>
      {exceptionType && <Text style={styles.exceptionText}>{exceptionString}</Text>}
      <Text style={styles.itemNameText}>{itemName}</Text>
      <View style={styles.nbrContainer}>
        <Text style={styles.itemNbrText}>{`${strings('ITEM.ITEM')} ${itemNbr}`}</Text>
        <Text style={styles.nbrDivider}>|</Text>
        <Text style={styles.upcNbrText}>{`${strings('ITEM.UPC')} ${upcNbr}`}</Text>
      </View>
      <Text style={styles.statusText}>{`${strings('ITEM.STATUS')}: ${status}`}</Text>
      <Text style={styles.catgText}>{`${strings('ITEM.CATEGORY')}: ${category}`}</Text>
      <Text style={styles.priceText}>{`${currencies(price)}`}</Text>
      <Button
        type={2}
        title={strings('PRINT.PRICE_SIGN')}
        titleColor={COLOR.MAIN_THEME_COLOR}
        style={styles.printPriceBtn}
        onPress={handlePrintPriceSign}
      />
    </View>
  );
};

export default ItemInfo;
