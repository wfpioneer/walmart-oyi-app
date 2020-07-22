import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TextInput } from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import { PrintPriceSignStackParamList } from '../../navigators/PrintPriceSignNavigator';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';

type PrintPriceSignScreenRouteParam = RouteProp<PrintPriceSignStackParamList, 'PrintPriceSignScreen'>;

const wineCatgNbr = 19;

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
  const [isLaser, setIsLaser] = useState(true);
  const [signType, setSignType] = useState('')

  const { itemName, itemNbr, upcNbr, category } = route.params;
  const catgNbr = parseInt(category.split('-')[0]);


  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text);
    if(!isNaN(newQty)) {
      setSignQty(newQty);
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
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'stretch'}}>
        <View style={{backgroundColor: COLOR.WHITE, flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 16}}>
          <Image source={require('../../assets/images/sams_logo.jpeg')} style={{height: 65, width: 65, resizeMode: 'stretch'}} />
          <Text style={{marginHorizontal: 8, fontSize: 12, fontWeight: 'bold', flexWrap: 'wrap', flex: 1, lineHeight: 16}} >{itemName}</Text>
        </View>
        <View style={{backgroundColor: COLOR.WHITE, alignItems: 'center', marginTop: 8, paddingHorizontal: 8, paddingVertical: 16}} >
          <Text style={{marginVertical: 8, fontSize: 12, color: COLOR.GREY_500}} >Number of copies</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 6}}>
            <IconButton
              icon={renderPlusMinusBtn('minus')}
              type={IconButton.Type.SOLID_WHITE}
              backgroundColor={COLOR.GREY_400}
              height={30}
              width={30}
              radius={50}
              onPress={() => setSignQty(prevState => prevState - 1)}
            />
            <TextInput
              style={{textAlign: 'center', minWidth: '15%', height: 30, fontSize: 12, borderColor: COLOR.MAIN_THEME_COLOR, borderWidth: 1, marginHorizontal: 12, padding: 6}}
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
              onPress={() => setSignQty(prevState => prevState + 1)}
            />
          </View>
        </View>
        <View style={{backgroundColor: COLOR.WHITE, alignItems: 'center', marginTop: 8, paddingHorizontal: 8, paddingVertical: 12}} >
          <Text style={{marginVertical: 8, fontSize: 12, color: COLOR.GREY_500}} >Sign Size</Text>
          {renderSignSizeButtons(isLaser, catgNbr, signType, setSignType)}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLOR.WHITE, alignItems: 'flex-end', marginTop: 8, paddingHorizontal: 8, paddingVertical: 12}}>
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
      <View style={{flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLOR.WHITE, paddingHorizontal: 4, paddingTop: 8, paddingBottom: 20, elevation: 16}}>
        <Button
          title={'Add to print list'}
          titleColor={COLOR.MAIN_THEME_COLOR}
          type={Button.Type.SOLID_WHITE}
          style={{flex: 1, paddingHorizontal: 4}}
          onPress={handleAddPrintList}
        />
        <Button
          title={'Print'}
          type={Button.Type.PRIMARY}
          style={{flex: 1, paddingHorizontal: 4}}
          onPress={handlePrint}
        />
      </View>
    </SafeAreaView>
  )
}

export default PrintPriceSign;
