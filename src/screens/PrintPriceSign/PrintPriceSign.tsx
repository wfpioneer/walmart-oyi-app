import React, {
  EffectCallback, useEffect, useLayoutEffect, useState
} from 'react';
import {
  ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import {
  NavigationProp, Route, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import { numbers, strings } from '../../locales';
import styles from './PrintPriceSign.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getMockItemDetails } from '../../mockData';
import {
  addToPrintQueue, addToPrinterList, setSelectedPrinter, setSignType, togglePrintScreen
} from '../../state/actions/Print';
import { setActionCompleted } from '../../state/actions/ItemDetailScreen';
import {
  LaserPaper, PortablePaper, PrintItemList, PrintLocationList, PrintPaperSize, PrintQueueItem, Printer, PrinterType
} from '../../models/Printer';
import { printLocationLabel, printSign } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { AsyncState } from '../../models/AsyncState';
import { PRINT_SIGN } from '../../state/actions/asyncAPI';

const wineCatgNbr = 19;
const QTY_MIN = 1;
const QTY_MAX = 100;
const ERROR_FORMATTING_OPTIONS = {
  min: QTY_MIN,
  max: numbers(QTY_MAX, { precision: 0 })
};

export const validateQty = (qty: number): boolean => QTY_MIN <= qty && qty <= QTY_MAX;

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);

export const renderSignSizeButtons = (
  selectedPrinter: Printer, catgNbr: number, signType: string, dispatch: Dispatch<any>
): JSX.Element => {
  const sizeObject = selectedPrinter.type === PrinterType.LASER ? LaserPaper : PortablePaper;
  return (
    <View style={styles.sizeBtnContainer}>
      {Object.keys(sizeObject).map(key => {
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

interface PriceSignProps {
  scannedEvent: {value: any; type: any };
  exceptionType: string;
  actionCompleted: boolean;
  result: any;
  printAPI: AsyncState
  printLabelAPI: AsyncState
  selectedPrinter: Printer;
  selectedSignType: PrintPaperSize;
  isPrintLocation: boolean;
  locationName: string;
  sectionId: number;
  printQueue: PrintQueueItem[];
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: Route<any>;
  signQty: number; setSignQty: React.Dispatch<React.SetStateAction<number>>;
  isValidQty: boolean; setIsValidQty: React.Dispatch<React.SetStateAction<boolean>>;
  error: { error: boolean; message: string };
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string }>>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  useLayoutHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
}

const getPrinter = (selectedPrinter: Printer, selectedSignType: PrintPaperSize) => (
  selectedPrinter.type === PrinterType.LASER
    // @ts-ignore
    ? LaserPaper[selectedSignType] : PortablePaper[selectedSignType]);
const isValid = (actionCompleted: any, exceptionType: any) => !actionCompleted && exceptionType === 'PO';

const isItemSizeExists = (printQueue: PrintQueueItem[], selectedSignType: PrintPaperSize, itemNbr: number) => (
  printQueue.some(printItem => printItem.itemNbr === itemNbr
    && printItem.paperSize === selectedSignType));

const aisleSectionExists = (printQueue: PrintQueueItem[], locationId: number) => (
  printQueue.some(printLoc => printLoc.locationId === locationId));

const setHandleDecreaseQty = (signQty: number, setSignQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (signQty > QTY_MAX) {
    setSignQty(QTY_MAX);
  } else if (signQty > QTY_MIN) {
    setSignQty(((prevState: number) => prevState - 1));
  }
};

const setHandleIncreaseQty = (signQty: number, setSignQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (signQty < QTY_MIN) {
    setSignQty(QTY_MIN);
  } else if (signQty < QTY_MAX) {
    setSignQty(((prevState: number) => prevState + 1));
  }
};
const isErrorRequired = (error: { error: boolean; message: string }) => (
  error.error
    ? (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    )
    : null
);
const validateQuantity = (isValidQty: boolean) => (
  !isValidQty && (
    <Text style={styles.invalidLabel}>
      {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
    </Text>
  )
);
const isValidQtyStyle = (isValidQty: boolean) => (isValidQty ? styles.copyQtyInputValid : styles.copyQtyInputInvalid);
const isAddtoQueueDisabled = (isValidQty: boolean, selectedSignType: PrintPaperSize) => (!isValidQty
  || selectedSignType?.length === 0);
const checkQuantity = (newQty: number, setIsValidQty: React.Dispatch<React.SetStateAction<boolean>>,
  setSignQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (!Number.isNaN(newQty)) {
    setSignQty(newQty);
    setIsValidQty(validateQty(newQty));
  }
};
const isValidDispatch = (props: PriceSignProps, actionCompleted: boolean,
  exceptionType: string) => {
  const {
    dispatch
  } = props;
  if (isValid(actionCompleted, exceptionType)) {
    dispatch(setActionCompleted());
  }
};
const isResultHasData = (result: any) => (result && result.data);

export const PrintPriceSignScreen = (props: PriceSignProps): JSX.Element => {
  const {
    scannedEvent, exceptionType, actionCompleted, result, isPrintLocation,
    printAPI, printLabelAPI, selectedPrinter, selectedSignType, printQueue,
    dispatch, navigation, route, signQty, setSignQty, isValidQty,
    setIsValidQty, error, setError, useEffectHook, useLayoutHook,
    sectionId, locationName
  } = props;
  const {
    itemName, itemNbr, upcNbr, categoryNbr
  } = isResultHasData(result) || getMockItemDetails(scannedEvent.value);

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

  // Navigation Listener
  useEffectHook(() => {
    // Resets Print api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: PRINT_SIGN.RESET });
      // Set Print Label Toggle back to Item Labels
      dispatch(togglePrintScreen(false));
    });
  }, []);

  // Print Sign API
  useEffectHook(() => {
    // on api success
    if (!printAPI.isWaiting && printAPI.result) {
      if (!actionCompleted && exceptionType === 'PO') {
        dispatch(setActionCompleted());
      }
      navigation.goBack();
    }

    // on api failure
    if (!printAPI.isWaiting && printAPI.error) {
      setError({ error: true, message: strings('PRINT.PRINT_SERVICE_ERROR') });
    }

    // on api submission
    if (printAPI.isWaiting) {
      setError({ error: false, message: '' });
    }
  }, [printAPI]);

  // Print Label API
  useEffectHook(() => {
    // on api success
    if (!printLabelAPI.isWaiting && printLabelAPI.result) {
      isValidDispatch(props, actionCompleted, exceptionType);
      navigation.goBack();
    }
    // on api failure
    if (!printLabelAPI.isWaiting && printLabelAPI.error) {
      setError({ error: true, message: strings('PRINT.PRINT_SERVICE_ERROR') });
    }
    // on api submission
    if (printLabelAPI.isWaiting) {
      setError({ error: false, message: '' });
    }
  }, [printLabelAPI]);

  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    checkQuantity(newQty, setIsValidQty, setSignQty);
  };

  const handleIncreaseQty = () => {
    setIsValidQty(true);
    setHandleIncreaseQty(signQty, setSignQty);
  };

  const handleDecreaseQty = () => {
    setIsValidQty(true);
    setHandleDecreaseQty(signQty, setSignQty);
  };

  const handleChangePrinter = () => {
    validateSession(navigation, route.name).then(() => {
      trackEvent('print_change_printer_click');
      navigation.navigate('PrinterList');
    }).catch(() => { });
  };


  const handleAddPrintList = () => {
    // check if the item/size already exists on the print queue
    const itemSizeExists = isItemSizeExists(printQueue, selectedSignType, itemNbr);
    const locationLabelExists = aisleSectionExists(printQueue, sectionId);
    let printQueueItem: PrintQueueItem;
    if (itemSizeExists || locationLabelExists) {
      // TODO show popup if already exists
      trackEvent('print_already_exists_in_queue', { itemName, selectedSignType });
    } else {
      if (isPrintLocation) {
        printQueueItem = {
          itemType: 'LOCATION',
          locationId: sectionId,
          paperSize: 'XSmall', // TODO properly set selectedsignType to permanently be XSMALL on Print Labels screen
          signQty
        };
      } else {
        // add to print queue, forcing to use laser
        // TODO show popup if laser printer is not selected when adding to queue
        // TODO show toast that the item was added to queue
        printQueueItem = {
          itemName,
          itemNbr,
          upcNbr,
          catgNbr: categoryNbr,
          signQty,
          worklistType: exceptionType ?? '',
          paperSize: selectedSignType,
          itemType: 'ITEM'
        };
      }
      trackEvent('print_add_to_print_queue', { printQueueItem: JSON.stringify(printQueueItem) });
      dispatch(addToPrintQueue(printQueueItem));
      isValidDispatch(props, actionCompleted, exceptionType);
      navigation.goBack();
    }
  };

  const handlePrint = () => {
    validateSession(navigation, route.name).then(() => {
      if (isPrintLocation) {
        const printLocList: PrintLocationList[] = [{
          locationId: 0,
          qty: signQty,
          printerMACAddress: selectedPrinter.id
        }];
        trackEvent('print_section_label', { printItem: JSON.stringify(printLocList) });
        dispatch(printLocationLabel({ printLabelList: printLocList }));
      } else {
        const printlist: PrintItemList[] = [
          {
            itemNbr,
            qty: signQty,
            code: getPrinter(selectedPrinter, selectedSignType),
            description: selectedSignType,
            printerMACAddress: selectedPrinter.id,
            isPortablePrinter: selectedPrinter.type === 1,
            workListTypeCode: exceptionType
          }
        ];
        trackEvent('print_price_sign', { printItem: JSON.stringify(printlist) });
        dispatch(printSign({ printList: printlist }));
      }
    }).catch(() => { });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemNameTxt}>{isPrintLocation ? locationName : itemName}</Text>
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
              style={[styles.copyQtyInput, isValidQtyStyle(isValidQty)]}
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
          {validateQuantity(isValidQty)}
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
        {isErrorRequired(error)}
      </ScrollView>
      {(printAPI.isWaiting || printLabelAPI.isWaiting) ? (
        <View style={styles.footerBtnContainer}>
          <ActivityIndicator
            animating={printAPI.isWaiting || printLabelAPI.isWaiting}
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
            disabled={isAddtoQueueDisabled(isValidQty, selectedSignType)}
          />
          <Button
            title={strings('PRINT.PRINT')}
            type={Button.Type.PRIMARY}
            style={styles.footerBtn}
            onPress={handlePrint}
            disabled={isAddtoQueueDisabled(isValidQty, selectedSignType)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const PrintPriceSign = (): JSX.Element => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const { exceptionType, actionCompleted } = useTypedSelector(state => state.ItemDetailScreen);
  const { result } = useTypedSelector(state => state.async.getItemDetails);
  const printAPI = useTypedSelector(state => state.async.printSign);
  const {
    selectedPrinter, selectedSignType, printQueue, isPrintLocation
  } = useTypedSelector(state => state.Print);
  const printLabelAPI = useTypedSelector(state => state.async.printLocationLabels);
  const { selectedAisle, selectedZone, selectedSection } = useTypedSelector(state => state.Location);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [signQty, setSignQty] = useState(1);
  const [isValidQty, setIsValidQty] = useState(true);
  const [error, setError] = useState({ error: false, message: '' });
  const locationName = `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`;

  return (
    <PrintPriceSignScreen
      scannedEvent={scannedEvent}
      exceptionType={exceptionType ?? ''}
      actionCompleted={actionCompleted}
      result={result}
      printAPI={printAPI}
      printLabelAPI={printLabelAPI}
      selectedPrinter={selectedPrinter}
      selectedSignType={selectedSignType}
      printQueue={printQueue}
      isPrintLocation={isPrintLocation}
      locationName={locationName}
      sectionId={selectedSection.id}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      signQty={signQty}
      setSignQty={setSignQty}
      isValidQty={isValidQty}
      setIsValidQty={setIsValidQty}
      error={error}
      setError={setError}
      useEffectHook={useEffect}
      useLayoutHook={useLayoutEffect}
    />
  );
};
export default PrintPriceSign;
