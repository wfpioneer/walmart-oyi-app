import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TextInput } from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import { PrintPriceSignStackParamList } from '../../navigators/PrintPriceSignNavigator';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type PrintPriceSignScreenRouteParam = RouteProp<PrintPriceSignStackParamList, 'PrintPriceSignScreen'>;


const renderPlusMinusBtn = (name: 'plus' | 'minus') => {
  return (
    <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
  )
}

const PrintPriceSign = () => {
  const route = useRoute<PrintPriceSignScreenRouteParam>()
  const [signQty, setSignQty] = useState(1);

  const { itemName, itemNbr, upcNbr, category } = route.params;


  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text);
    if(!isNaN(newQty)) {
      setSignQty(newQty);
    }
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
        <View>
          <Text></Text>
          <View></View>
        </View>
        <View>
          <Image source={{}} />
          <View>
            <Text></Text>
            <Text></Text>
          </View>
          <Button />
        </View>
      </ScrollView>
      <View>
        <Button />
        <Button />
      </View>
    </SafeAreaView>
  )
}

export default PrintPriceSign;
