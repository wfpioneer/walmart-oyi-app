import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TextInput } from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import { PrintPriceSignStackParamList } from '../../navigators/PrintPriceSignNavigator';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { numbers, strings } from '../../locales';
import styles from './PrintPriceSign.style'

type PrintPriceSignScreenRouteParam = RouteProp<PrintPriceSignStackParamList, 'PrintPriceSignScreen'>;

const wineCatgNbr = 19;
const QTY_MIN = 1;
const QTY_MAX = 100;
const ERROR_FORMATTING_OPTIONS = {
  min: QTY_MIN,
  max: numbers(QTY_MAX, {precision: 0})
};

const Laser = {
  'XSmall': 'X',
  'Small': 'S',
  'Wine': 'W',
  'Medium': 'F',
  'Large': 'H'
}

const Portable = {
  'XSmall': 'j',
  'Small': 'C',
  'Wine': 'W',
  'Medium': 'D'
}

const validateQty = (qty: number) => {
  return QTY_MIN <= qty && qty <= QTY_MAX;
}

const renderPlusMinusBtn = (name: 'plus' | 'minus') => {
  return (
    <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
  )
}

const renderSignSizeButtons = (isLaser: boolean, catgNbr: number, signType: string, setSignType: Function) => {
  const sizeObject = isLaser ? Laser : Portable;

  return (
    <View style={{flexDirection: 'row', marginVertical: 4}} >
      {Object.keys(sizeObject).map((key: string) => {
        // Only show the wine button if the item's category is appropriate
        if(key !== 'Wine' || (key === 'Wine' && catgNbr === wineCatgNbr)) {
          return (
            <Button
              key={key}
              title={strings(`PRINT.${key}`)}
              titleFontSize={12}
              titleFontWeight={'bold'}
              titleColor={signType === key ? COLOR.WHITE : COLOR.BLACK}
              backgroundColor={signType === key ? COLOR.MAIN_THEME_COLOR : COLOR.GREY_200}
              type={Button.Type.PRIMARY}
              radius={20}
              height={25}
              width={56}
              style={{marginHorizontal: 6}}
              onPress={() => setSignType(key)}
            />
          )
        }
      })}
    </View>
  )
}

const PrintPriceSign = () => {
  const route = useRoute<PrintPriceSignScreenRouteParam>()
  const [signQty, setSignQty] = useState(1);
  const [isValidQty, setIsValidQty] = useState(true);
  const [isLaser, setIsLaser] = useState(true);
  const [signType, setSignType] = useState('');

  const { itemName, itemNbr, upcNbr, category } = route.params;
  const catgNbr = parseInt(category.split('-')[0]);


  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text);
    if(!isNaN(newQty)) {
      setSignQty(newQty);
      setIsValidQty(validateQty(newQty));
    }
  }

  const handleIncreaseQty = () => {
    setIsValidQty(true);
    if (signQty < QTY_MIN) {
      setSignQty(QTY_MIN);
    } else if (signQty < QTY_MAX) {
      setSignQty((prevState => prevState + 1));
    }
  }

  const handleDecreaseQty = () => {
    setIsValidQty(true);
    if (signQty > QTY_MAX) {
      setSignQty(QTY_MAX);
    } else if (signQty > QTY_MIN) {
      setSignQty((prevState => prevState - 1));
    }
  }

  const handleChangePrinter = () => {
    console.log('Change printer clicked');
  }

  const handleAddPrintList = () => {
    console.log('ADD TO PRINT LIST clicked');
  }

  const handlePrint = () => {
    console.log('PRINT clicked');
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.itemDetailsContainer}>
          <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.itemImage} />
          <Text style={styles.itemNameTxt} >{itemName}</Text>
        </View>
        <View style={styles.copyQtyContainer} >
          <Text style={styles.copyQtyLabel} >{strings('PRINT.COPY_QTY')}</Text>
          <View style={styles.qtyChangeContainer}>
            <IconButton
              icon={renderPlusMinusBtn('minus')}
              type={IconButton.Type.SOLID_WHITE}
              backgroundColor={COLOR.GREY_400}
              height={30}
              width={30}
              radius={50}
              onPress={handleDecreaseQty}
            />
            <TextInput
              style={[styles.copyQtyInput, isValidQty ? styles.copyQtyInputValid : styles.copyQtyInputInvalid]}
              keyboardType={'numeric'}
              onChangeText={handleTextChange}
            >
              {signQty}
            </TextInput>
            <IconButton
              icon={renderPlusMinusBtn('plus')}
              type={IconButton.Type.SOLID_WHITE}
              backgroundColor={COLOR.GREY_400}
              height={30}
              width={30}
              radius={50}
              onPress={handleIncreaseQty}
            />
          </View>
          {!isValidQty && <Text style={styles.invalidLabel}>
            {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
          </Text>}
        </View>
        <View style={styles.signSizeContainer} >
          <Text style={styles.signSizeLabel} >{strings('PRINT.SIGN_SIZE')}</Text>
          {renderSignSizeButtons(isLaser, catgNbr, signType, setSignType)}
        </View>
        <View style={styles.printerContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcon name={'printer-check'} size={24} />
            <View style={{marginLeft: 12}}>
              <Text>Front desk printer</Text>
              <Text style={{fontSize: 12, color: COLOR.GREY_600}} >Default</Text>
            </View>
          </View>
          <Button
            title={'Change'}
            titleColor={COLOR.MAIN_THEME_COLOR}
            titleFontSize={14}
            type={Button.Type.NO_BORDER}
            height={20}
            onPress={handleChangePrinter}
          />
        </View>
      </ScrollView>
      <View style={styles.footerBtnContainer}>
        <Button
          title={'Add to print list'}
          titleColor={COLOR.MAIN_THEME_COLOR}
          type={Button.Type.SOLID_WHITE}
          style={styles.footerBtns}
          onPress={handleAddPrintList}
        />
        <Button
          title={'Print'}
          type={Button.Type.PRIMARY}
          style={styles.footerBtns}
          onPress={handlePrint}
        />
      </View>
    </SafeAreaView>
  )
}

export default PrintPriceSign;
