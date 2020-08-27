import React, { useLayoutEffect, useState } from 'react';
import {
  Image, SafeAreaView, ScrollView, Text, TextInput, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import { numbers, strings } from '../../locales';
import styles from './PrintPriceSign.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getMockItemDetails } from '../../mockData';
import {
  addToPrintQueue, addToPrinterList, setSelectedPrinter, setSignType
} from '../../state/actions/Print';
import {
  LaserPaper, PortablePaper, PrintQueueItem, Printer, PrinterType
} from '../../models/Printer';

const wineCatgNbr = 19;
const QTY_MIN = 1;
const QTY_MAX = 100;
const ERROR_FORMATTING_OPTIONS = {
  min: QTY_MIN,
  max: numbers(QTY_MAX, { precision: 0 })
};

const validateQty = (qty: number) => QTY_MIN <= qty && qty <= QTY_MAX;

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);

const renderSignSizeButtons = (selectedPrinter: Printer, catgNbr: number, signType: string, dispatch: Function) => {
  const sizeObject = selectedPrinter.type === PrinterType.LASER ? LaserPaper : PortablePaper;

  return (
    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
      {Object.keys(sizeObject).map((key: string) => {
        // Only show the wine button if the item's category is appropriate
        if (key !== 'Wine' || (key === 'Wine' && catgNbr === wineCatgNbr)) {
          return (
            <Button
              key={key}
              title={strings(`PRINT.${key}`)}
              titleFontSize={12}
              titleFontWeight="bold"
              titleColor={signType === key ? COLOR.WHITE : COLOR.BLACK}
              backgroundColor={signType === key ? COLOR.MAIN_THEME_COLOR : COLOR.GREY_200}
              type={Button.Type.PRIMARY}
              radius={20}
              height={25}
              width={56}
              style={{ marginHorizontal: 6 }}
              onPress={() => dispatch(setSignType(key))}
            />
          );
        }
      })}
    </View>
  );
};

const PrintPriceSign = () => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const { result } = useTypedSelector(state => state.async.getItemDetails);
  const { selectedPrinter, selectedSignType, printQueue } = useTypedSelector(state => state.Print);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [signQty, setSignQty] = useState(1);
  const [isValidQty, setIsValidQty] = useState(true);

  const {
    itemName, itemNbr, upcNbr, category
  } = (result && result.data) || getMockItemDetails(scannedEvent.value);
  const catgNbr = parseInt(category.split('-')[0], 10);

  useLayoutEffect(() => {
    // Just used to set the default printer the first time, since redux loads before the translations
    if (selectedPrinter.name === '') {
      const initialPrinter: Printer = {
        type: PrinterType.LASER,
        name: strings('PRINT.FRONT_DESK'),
        desc: strings('GENERICS.DEFAULT'),
        id: 0
      };
      dispatch(setSelectedPrinter(initialPrinter));
      dispatch(addToPrinterList(initialPrinter));
    }
  }, []);


  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(newQty)) {
      setSignQty(newQty);
      setIsValidQty(validateQty(newQty));
    }
  };

  const handleIncreaseQty = () => {
    setIsValidQty(true);
    if (signQty < QTY_MIN) {
      setSignQty(QTY_MIN);
    } else if (signQty < QTY_MAX) {
      setSignQty((prevState => prevState + 1));
    }
  };

  const handleDecreaseQty = () => {
    setIsValidQty(true);
    if (signQty > QTY_MAX) {
      setSignQty(QTY_MAX);
    } else if (signQty > QTY_MIN) {
      setSignQty((prevState => prevState - 1));
    }
  };

  const handleChangePrinter = () => {
    navigation.navigate('PrinterList');
  };

  const handleAddPrintList = () => {
    console.log('ADD TO PRINT LIST clicked');

    // check if the item/size already exists on the print queue
    const itemSizeExists = printQueue.some((printItem: PrintQueueItem) => printItem.itemNbr === itemNbr
      && printItem.paperSize === selectedSignType);

    if (itemSizeExists) {
      // TODO show popup if already exists
      console.log(`Sign already exists in queue for  - ${JSON.stringify({ itemName, selectedSignType })}`);
    } else {
      // add to print queue, forcing to use laser
      // TODO show popup if laser printer is not selected when adding to queue
      // TODO show toast that the item was added to queue
      const printQueueItem: PrintQueueItem = {
        itemName,
        itemNbr,
        upcNbr,
        catgNbr,
        signQty,
        paperSize: selectedSignType
      };
      dispatch(addToPrintQueue(printQueueItem));
      navigation.goBack();
    }
  };

  const handlePrint = () => {
    console.log('PRINT clicked');
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.itemDetailsContainer}>
          <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.itemImage} />
          <Text style={styles.itemNameTxt}>{itemName}</Text>
        </View>
        <View style={styles.copyQtyContainer}>
          <Text style={styles.copyQtyLabel}>{strings('PRINT.COPY_QTY')}</Text>
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
              keyboardType="numeric"
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
          {!isValidQty && (
          <Text style={styles.invalidLabel}>
            {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
          </Text>
          )}
        </View>
        <View style={styles.signSizeContainer}>
          <Text style={styles.signSizeLabel}>{strings('PRINT.SIGN_SIZE')}</Text>
          {renderSignSizeButtons(selectedPrinter, catgNbr, selectedSignType, dispatch)}
        </View>
        <View style={styles.printerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon name="printer-check" size={24} />
            <View style={{ marginLeft: 12 }}>
              <Text>{selectedPrinter.name}</Text>
            </View>
          </View>
          <Button
            title={strings('GENERICS.CHANGE')}
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
          title={strings('PRINT.ADD_TO_QUEUE')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          type={Button.Type.SOLID_WHITE}
          style={styles.footerBtn}
          onPress={handleAddPrintList}
          disabled={!isValidQty || selectedSignType?.length === 0}
        />
        <Button
          title={strings('PRINT.PRINT')}
          type={Button.Type.PRIMARY}
          style={styles.footerBtn}
          onPress={handlePrint}
          disabled={!isValidQty || selectedSignType?.length === 0}
        />
      </View>
    </SafeAreaView>
  );
};

export default PrintPriceSign;
