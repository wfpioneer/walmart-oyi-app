import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator, Image, SafeAreaView, ScrollView, Text, TextInput, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  NavigationProp, Route, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import image from '../../assets/image';
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
import { setActionCompleted } from '../../state/actions/ItemDetailScreen';
import {
  LaserPaper, PortablePaper, PrintQueueItem, Printer, PrinterType
} from '../../models/Printer';
import { printSign } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';

const wineCatgNbr = 19;
const QTY_MIN = 1;
const QTY_MAX = 100;
const ERROR_FORMATTING_OPTIONS = {
  min: QTY_MIN,
  max: numbers(QTY_MAX, { precision: 0 })
};

export const validateQty = (qty: number) => QTY_MIN <= qty && qty <= QTY_MAX;

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);

export const renderSignSizeButtons = (
  selectedPrinter: Printer, catgNbr: number, signType: string, dispatch: Function
) => {
  const sizeObject = selectedPrinter.type === PrinterType.LASER ? LaserPaper : PortablePaper;
  return (
    <View style={styles.sizeBtnContainer}>
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
              style={styles.sizeBtnMargin}
              onPress={() => dispatch(setSignType(key))}
            />
          );
        }

        return null;
      })}
    </View>
  );
};

const PrintPriceSign = () => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const { exceptionType, actionCompleted } = useTypedSelector(state => state.ItemDetailScreen);
  const { result } = useTypedSelector(state => state.async.getItemDetails);
  const printAPI = useTypedSelector(state => state.async.printSign);
  const { selectedPrinter, selectedSignType, printQueue } = useTypedSelector(state => state.Print);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [signQty, setSignQty] = useState(1);
  const [isValidQty, setIsValidQty] = useState(true);
  const [apiInProgress, setAPIInProgress] = useState(false);
  const [error, setError] = useState({ error: false, message: '' });
  const [apiStart, setApiStart] = useState(0);

  return (
    <PrintPriceSignScreen
      scannedEvent={scannedEvent}
      exceptionType={exceptionType}
      actionCompleted={actionCompleted}
      result={result}
      printAPI={printAPI}
      selectedPrinter={selectedPrinter}
      selectedSignType={selectedSignType}
      printQueue={printQueue}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      signQty={signQty}
      setSignQty={setSignQty}
      isValidQty={isValidQty}
      setIsValidQty={setIsValidQty}
      apiInProgress={apiInProgress}
      setAPIInProgress={setAPIInProgress}
      error={error}
      setError={setError}
      apiStart={apiStart}
      setApiStart={setApiStart}
      useEffectHook={useEffect}
      useLayoutHook={useLayoutEffect}
    />
  );
};
interface PriceSignProps {
  scannedEvent: {value: any; type: any };
  exceptionType: string;
  actionCompleted: boolean;
  result: any;
  printAPI: {
    isWaiting: boolean;
    value: any;
    error: any;
    result: any;
  };
  selectedPrinter: Printer;
  selectedSignType: LaserPaper | PortablePaper;
  printQueue: PrintQueueItem[];
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: Route<any>;
  signQty: number; setSignQty: Function;
  isValidQty: boolean; setIsValidQty: Function;
  apiInProgress: boolean; setAPIInProgress: Function;
  error: { error: boolean; message: string };
  setError: Function;
  apiStart: number; setApiStart: Function;
  useEffectHook: Function;
  useLayoutHook: Function;
}
export const PrintPriceSignScreen = (props: PriceSignProps) => {
  const {
    scannedEvent, exceptionType, actionCompleted, result,
    printAPI, selectedPrinter, selectedSignType, printQueue,
    dispatch, navigation, route, signQty, setSignQty, isValidQty,
    setIsValidQty, apiInProgress, setAPIInProgress, error,
    setError, apiStart, setApiStart, useEffectHook, useLayoutHook
  } = props;
  const {
    itemName, itemNbr, upcNbr, categoryNbr
  } = (result && result.data) || getMockItemDetails(scannedEvent.value);

  useLayoutHook(() => {
    // Just used to set the default printer the first time, since redux loads before the translations
    if (selectedPrinter.name === '') {
      const initialPrinter: Printer = {
        type: PrinterType.LASER,
        name: strings('PRINT.FRONT_DESK'),
        desc: strings('GENERICS.DEFAULT'),
        id: '000000000000'
      };
      dispatch(setSelectedPrinter(initialPrinter));
      dispatch(addToPrinterList(initialPrinter));
    }
  }, []);
  // Print API
  useEffectHook(() => {
    // on api success
    if (apiInProgress && printAPI.isWaiting === false && printAPI.result) {
      trackEvent('print_api_success', { duration: moment().valueOf() - apiStart });
      if (!actionCompleted && exceptionType === 'PO') dispatch(setActionCompleted());
      setAPIInProgress(false);
      navigation.goBack();
      return undefined;
    }

    // on api failure
    if (apiInProgress && printAPI.isWaiting === false && printAPI.error) {
      trackEvent('print_api_failure', {
        errorDetails: printAPI.error.message || JSON.stringify(printAPI.error), duration: moment().valueOf() - apiStart
      });
      setAPIInProgress(false);
      return setError({ error: true, message: strings('PRINT.PRINT_SERVICE_ERROR') });
    }

    // on api submission
    if (!apiInProgress && printAPI.isWaiting) {
      setError({ error: false, message: '' });
      return setAPIInProgress(true);
    }

    return undefined;
  }, [printAPI]);

  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    if (!Number.isNaN(newQty)) {
      setSignQty(newQty);
      setIsValidQty(validateQty(newQty));
    }
  };

  const handleIncreaseQty = () => {
    setIsValidQty(true);
    if (signQty < QTY_MIN) {
      setSignQty(QTY_MIN);
    } else if (signQty < QTY_MAX) {
      setSignQty(((prevState: number) => prevState + 1));
    }
  };

  const handleDecreaseQty = () => {
    setIsValidQty(true);
    if (signQty > QTY_MAX) {
      setSignQty(QTY_MAX);
    } else if (signQty > QTY_MIN) {
      setSignQty(((prevState: number) => prevState - 1));
    }
  };

  const handleChangePrinter = () => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('print_change_printer_click');
      navigation.navigate('PrinterList');
    }).catch(() => {});
  };

  const handleAddPrintList = () => {
    // check if the item/size already exists on the print queue
    const itemSizeExists = printQueue.some((printItem: PrintQueueItem) => printItem.itemNbr === itemNbr
      && printItem.paperSize === selectedSignType);

    if (itemSizeExists) {
      // TODO show popup if already exists
      trackEvent('print_already_exists_in_queue', { itemName, selectedSignType });
    } else {
      // add to print queue, forcing to use laser
      // TODO show popup if laser printer is not selected when adding to queue
      // TODO show toast that the item was added to queue
      const printQueueItem: PrintQueueItem = {
        itemName,
        itemNbr,
        upcNbr,
        catgNbr: categoryNbr,
        signQty,
        worklistType: exceptionType,
        paperSize: selectedSignType
      };
      trackEvent('print_add_to_print_queue', { printQueueItem: JSON.stringify(printQueueItem) });
      dispatch(addToPrintQueue(printQueueItem));
      if (!actionCompleted && exceptionType === 'PO') {
        dispatch(setActionCompleted());
      }
      navigation.goBack();
    }
  };

  const handlePrint = () => {
    validateSession(navigation, route.name).then(() => {
      const printlist = [
        {
          itemNbr,
          qty: signQty,
          code: selectedPrinter.type === PrinterType.LASER
            // @ts-ignore
            ? LaserPaper[selectedSignType] : PortablePaper[selectedSignType],
          description: selectedSignType,
          printerMACAddress: selectedPrinter.id,
          isPortablePrinter: selectedPrinter.type === 1,
          workListTypeCode: exceptionType
        }
      ];
      setApiStart(moment().valueOf());
      trackEvent('print_price_sign', JSON.stringify(printlist));
      dispatch(printSign({ printlist }));
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.itemDetailsContainer}>
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
          {renderSignSizeButtons(selectedPrinter, categoryNbr, selectedSignType, dispatch)}
        </View>
        <View style={styles.printerContainer}>
          <View style={styles.printerNameContainer}>
            <MaterialCommunityIcon name="printer-check" size={24} />
            <View style={styles.printTextMargin}>
              <Text>{selectedPrinter.name}</Text>
              <Text style={styles.printerDesc}>{selectedPrinter.desc}</Text>
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
        {error.error
          ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )
          : null}
      </ScrollView>
      {printAPI.isWaiting ? (
        <View style={styles.footerBtnContainer}>
          <ActivityIndicator
            animating={printAPI.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      ) : (
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
      )}
    </SafeAreaView>
  );
};

export default PrintPriceSign;
