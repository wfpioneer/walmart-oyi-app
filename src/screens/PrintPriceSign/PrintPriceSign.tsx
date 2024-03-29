import React, {
  EffectCallback, useEffect, useLayoutEffect, useState
} from 'react';
import {
  ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import {
  NavigationProp, Route, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { Dispatch } from 'redux';
import Toast from 'react-native-toast-message';
import { AxiosResponse } from 'axios';
import IconButton, { IconButtonType } from '../../components/buttons/IconButton';
import Button, { ButtonType } from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import { numbers, strings } from '../../locales';
import styles from './PrintPriceSign.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getMockItemDetails } from '../../mockData';
import {
  addLocationPrintQueue, addMultipleToLocationPrintQueue, addToPrintQueue, addToPrinterList,
  setPriceLabelPrinter, setPrintingType, setSignType, unsetPrintingLocationLabels, unsetPrintingPalletLabel
} from '../../state/actions/Print';
import { setActionCompleted } from '../../state/actions/ItemDetailScreen';
import {
  LaserPaperCn, LaserPaperMx, LaserPaperPrice, PortablePaperCn, PortablePaperMx, PrintItemList,
  PrintLocationList, PrintPalletList, PrintPaperSize, PrintQueueItem, PrintQueueItemType,
  Printer, PrinterType, PrintingType
} from '../../models/Printer';
import { Configurations } from '../../models/User';

import { printLocationLabel, printPalletLabel, printSign } from '../../state/actions/saga';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { AsyncState } from '../../models/AsyncState';
import { PRINT_LOCATION_LABELS, PRINT_PALLET_LABEL, PRINT_SIGN } from '../../state/actions/asyncAPI';
import ItemDetails from '../../models/ItemDetails';
import { LocationIdName } from '../../state/reducers/Location';
import { LocationName } from '../../models/Location';
import { SectionItem } from '../../models/LocationItems';
import { showInfoModal } from '../../state/actions/Modal';
import { savePrinter } from '../../utils/asyncStorageUtils';
import { PalletInfo } from '../../models/PalletManagementTypes';
import { getPaperSizeBasedOnCountry } from '../../utils/global';

const wineCatgNbr = 19;
const QTY_MIN = 1;
const QTY_MAX = 100;
const ERROR_FORMATTING_OPTIONS = {
  min: QTY_MIN,
  max: numbers(QTY_MAX, { precision: 0 })
};
const LOCATION_SECTION = 'LOCATION.SECTION';
const PRINT_ERROR = 'PRINT.PRINT_SERVICE_ERROR';

export const validateQty = (qty: number): boolean => QTY_MIN <= qty && qty <= QTY_MAX;

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);

export const renderSignSizeButtons = (
  selectedPrinter: Printer | null,
  catgNbr: number,
  signType: string,
  dispatch: Dispatch<any>,
  countryCode: string
): JSX.Element => {
  const sizeObject = getPaperSizeBasedOnCountry(selectedPrinter?.type, countryCode);
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
              backgroundColor={
                signType === key ? COLOR.MAIN_THEME_COLOR : COLOR.GREY_200
              }
              titleAlign="center"
              type={ButtonType.PRIMARY}
              radius={20}
              height={30}
              width="21%"
              style={styles.sizeBtnMargin}
              // @ts-expect-error key is of type PrinterPaperSize
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
  scannedEvent: { value: string | null; type: string | null };
  exceptionType: string;
  actionCompleted: boolean;
  itemResult: AxiosResponse | null;
  printAPI: AsyncState;
  printLabelAPI: AsyncState;
  printPalletAPI: AsyncState;
  sectionsResult: AxiosResponse | null;
  palletInfo: PalletInfo;
  selectedPrinter: Printer | null;
  selectedSignType: PrintPaperSize;
  printQueue: PrintQueueItem[];
  locationPrintQueue: PrintQueueItem[];
  printingLocationLabels: string;
  printingPalletLabel: boolean;
  selectedAisle: LocationIdName;
  selectedSection: LocationIdName;
  selectedZone: LocationIdName;
  printerList: Printer[];
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: Route<any>;
  signQty: number;
  setSignQty: React.Dispatch<React.SetStateAction<number>>;
  isValidQty: boolean;
  setIsValidQty: React.Dispatch<React.SetStateAction<boolean>>;
  error: { error: boolean; message: string };
  setError: React.Dispatch<
    React.SetStateAction<{ error: boolean; message: string }>
  >;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  useLayoutHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  userConfig: Configurations;
  countryCode: string;
}

export const getPrinter = (
  selectedPrinter: Printer | null,
  selectedSignType: PrintPaperSize,
  countryCode: string
): LaserPaperCn | PortablePaperCn | LaserPaperMx | PortablePaperMx | LaserPaperPrice => {
  const sizeObject = getPaperSizeBasedOnCountry(selectedPrinter?.type, countryCode);
  // @ts-expect-error selectSignType contains keys that do not exist for each enum
  return sizeObject[selectedSignType];
};

const isValid = (actionCompleted: boolean, exceptionType: string) => !actionCompleted
  && (exceptionType === 'PO' || exceptionType === 'C');

export const isItemSizeExists = (
  printQueue: PrintQueueItem[],
  selectedSignType: PrintPaperSize,
  itemNbr: number
) => printQueue.some(
  printItem => printItem.itemNbr === itemNbr && printItem.paperSize === selectedSignType
);

export const aisleSectionExists = (printQueue: PrintQueueItem[], locationId: number) => printQueue
  .some(printLoc => printLoc.locationId === locationId);

export const setHandleDecreaseQty = (
  signQty: number,
  setSignQty: React.Dispatch<React.SetStateAction<number>>
) => {
  if (signQty > QTY_MAX) {
    setSignQty(QTY_MAX);
  } else if (signQty > QTY_MIN) {
    setSignQty((prevState: number) => prevState - 1);
  }
};

export const setHandleIncreaseQty = (
  signQty: number,
  setSignQty: React.Dispatch<React.SetStateAction<number>>
) => {
  if (signQty < QTY_MIN) {
    setSignQty(QTY_MIN);
  } else if (signQty < QTY_MAX) {
    setSignQty((prevState: number) => prevState + 1);
  }
};
export const isErrorRequired = (error: { error: boolean; message: string }) => (error.error ? (
  <View style={styles.errorContainer}>
    <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
    <Text style={styles.errorText}>{error.message}</Text>
  </View>
) : null);

const validateQuantity = (isValidQty: boolean) => !isValidQty && (
<Text style={styles.invalidLabel}>
  {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
</Text>
);

const isValidQtyStyle = (isValidQty: boolean) => (isValidQty ? styles.copyQtyInputValid : styles.copyQtyInputInvalid);

const isAddtoQueueDisabled = (
  isValidQty: boolean,
  selectedSignType: PrintPaperSize
) => !isValidQty || selectedSignType?.length === 0;

export const checkQuantity = (
  newQty: number,
  setIsValidQty: React.Dispatch<React.SetStateAction<boolean>>,
  setSignQty: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!Number.isNaN(newQty)) {
    setSignQty(newQty);
    setIsValidQty(validateQty(newQty));
  }
};

export const isValidDispatch = (
  dispatch: Dispatch<any>,
  actionCompleted: boolean,
  exceptionType: string
) => {
  if (isValid(actionCompleted, exceptionType)) {
    dispatch(setActionCompleted());
  }
};

const isitemResultHasData = (itemResult: AxiosResponse | null) => (
  itemResult && (itemResult.data.itemDetails || itemResult.data)
);

export const handleAddPrintList = (
  printQueue: PrintQueueItem[],
  locationPrintQueue: PrintQueueItem[],
  selectedSignType: PrintPaperSize,
  itemDetails: ItemDetails,
  signQty: number,
  exceptionType: string,
  selectedSection: LocationIdName,
  actionCompleted: boolean,
  selectedAisle: LocationIdName,
  printingLocationLabels: string,
  locationName: string,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
) => {
  const {
    itemName, itemNbr, upcNbr, categoryNbr
  } = itemDetails;
  // check if the item/size already exists on the print queue
  const itemSizeExists = isItemSizeExists(printQueue, selectedSignType, itemNbr);
  // TODO Disable check on price sign screen and vice versa
  const locationLabelExists = aisleSectionExists(locationPrintQueue, selectedSection.id);
  // TODO Use LocationLabelCheck to allow some items to be added to the print queue
  if (itemSizeExists || (locationLabelExists && printingLocationLabels === LocationName.SECTION)) {
    // TODO show popup if already exists
    dispatch(showInfoModal(strings('LOCATION.PRINT_LABEL_EXISTS_HEADER'), strings('LOCATION.PRINT_LABEL_EXISTS')));
    trackEvent('print_already_exists_in_queue', { itemName, selectedSignType });
  } else {
    // add to print queue, forcing to use laser
    // TODO show popup if laser printer is not selected when adding to queue
    // TODO show toast that the item was added to queue
    let printQueueItem: PrintQueueItem;
    if (!printingLocationLabels) {
      printQueueItem = {
        itemName,
        itemNbr,
        upcNbr,
        catgNbr: categoryNbr,
        signQty,
        worklistType: exceptionType,
        paperSize: selectedSignType,
        itemType: PrintQueueItemType.ITEM
      };
      trackEvent('print_add_to_print_queue', { printQueueItem: JSON.stringify(printQueueItem) });
      dispatch(addToPrintQueue(printQueueItem));
    } else if (printingLocationLabels === LocationName.AISLE) {
      printQueueItem = {
        itemName: locationName,
        locationId: selectedAisle.id,
        paperSize: selectedSignType,
        signQty,
        itemType: PrintQueueItemType.AISLE
      };
      trackEvent('print_add_to_loc_print_queue', { printQueueItem: JSON.stringify(printQueueItem) });
      // dispatch(addMultipleToLocationPrintQueue(printQueueItems));
      dispatch(addLocationPrintQueue(printQueueItem));
    } else {
      const { id } = selectedSection;
      printQueueItem = {
        itemName: locationName,
        locationId: id,
        paperSize: selectedSignType,
        signQty,
        itemType: PrintQueueItemType.SECTION
      };
      trackEvent('print_add_to_loc_print_queue', { printQueueItem: JSON.stringify(printQueueItem) });
      dispatch(addLocationPrintQueue(printQueueItem));
    }
    navigation.goBack();
  }
};

export const printSignApiHook = (
  printAPI: AsyncState,
  navigation: NavigationProp<any>,
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string }>>,
  dispatch: Dispatch<any>,
  actionCompleted: boolean,
  exceptionType: string,
  route: RouteProp<any, string>
) => {
  // on api success
  if (!printAPI.isWaiting && printAPI.result) {
    if (printAPI.result.status === 200) {
      Toast.show({
        type: 'success',
        text1: strings('PRINT.PRICE_SIGN_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      });
      isValidDispatch(dispatch, actionCompleted, exceptionType);
      if (route.params && route.params.source === 'OtherAction') {
        navigation.navigate('ReviewItemDetailsHome');
      } else {
        navigation.goBack();
      }
    }
    if (printAPI.result.status === 204) {
      Toast.show({
        type: 'error',
        text1: strings('PALLET.ITEMS_NOT_FOUND'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    }
  }
  // on api failure
  if (!printAPI.isWaiting && printAPI.error) {
    setError({ error: true, message: strings(PRINT_ERROR) });
  }
  // on api submission
  if (printAPI.isWaiting) {
    setError({ error: false, message: '' });
  }
};

export const printLocationApiHook = (
  printLabelAPI: AsyncState,
  navigation: NavigationProp<any>,
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string }>>,
) => {
  // on api success
  if (!printLabelAPI.isWaiting && printLabelAPI.result) {
    Toast.show({
      type: 'success',
      text1: strings('PRINT.LOCATION_SUCCESS'),
      position: 'bottom',
      visibilityTime: 3000
    });
    navigation.goBack();
  }
  // on api failure
  if (!printLabelAPI.isWaiting && printLabelAPI.error) {
    setError({ error: true, message: strings(PRINT_ERROR) });
  }
  // on api submission
  if (printLabelAPI.isWaiting) {
    setError({ error: false, message: '' });
  }
};

export const printPalletApiHook = (
  printPalletAPI: AsyncState,
  navigation: NavigationProp<any>,
  setError: React.Dispatch<React.SetStateAction<{ error: boolean; message: string }>>,
) => {
  // on api success
  if (!printPalletAPI.isWaiting && printPalletAPI.result) {
    Toast.show({
      type: 'success',
      text1: strings('PRINT.PALLET_SUCCESS'),
      position: 'bottom',
      visibilityTime: 3000
    });
    navigation.goBack();
  }
  // on api failure
  if (!printPalletAPI.isWaiting && printPalletAPI.error) {
    setError({ error: true, message: strings(PRINT_ERROR) });
  }
  // on api submission
  if (printPalletAPI.isWaiting) {
    setError({ error: false, message: '' });
  }
};

export const setPrinterLayoutHook = (
  printerList: Printer[],
  selectedPrinter: Printer | null,
  dispatch: Dispatch<any>,
  printingPalletLabel: boolean,
  printingLocationLabels: string
) => {
  // Just used to set the default printer the first time, since redux loads before the translations
  const printListHasLaserPrinter = printerList.some(printer => printer.type === PrinterType.LASER);
  if (selectedPrinter?.name === '' || !printListHasLaserPrinter) {
    const defaultPrinter: Printer = {
      type: PrinterType.LASER,
      name: strings('PRINT.FRONT_DESK'),
      desc: strings('GENERICS.DEFAULT'),
      id: '000000000000',
      labelsAvailable: ['price']
    };
    dispatch(setPriceLabelPrinter(defaultPrinter));
    if (!printListHasLaserPrinter) {
      dispatch(addToPrinterList(defaultPrinter));
    }
    savePrinter(defaultPrinter);
  }
  if (printingPalletLabel) {
    dispatch(setPrintingType(PrintingType.PALLET));
  } else if (printingLocationLabels) {
    dispatch(setPrintingType(PrintingType.LOCATION));
  } else {
    dispatch(setPrintingType(PrintingType.PRICE_SIGN));
  }
};

export const handleChangePrinter = (navigation: NavigationProp<any>, route: RouteProp<any, string>) => {
  validateSession(navigation, route.name).then(() => {
    trackEvent('print_change_printer_click');
    navigation.navigate('PrinterList');
  }).catch(() => {});
};

export const handlePrint = (
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>,
  dispatch: Dispatch<any>,
  printingLocationLabels: string,
  selectedAisle: LocationIdName,
  signQty: number,
  selectedPrinter: Printer | null,
  selectedSection: LocationIdName,
  printingPalletLabel: boolean,
  palletId: number,
  itemNbr: number,
  selectedSignType: PrintPaperSize,
  exceptionType: string,
  countryCode: string
) => {
  validateSession(navigation, route.name)
    .then(() => {
      if (printingLocationLabels) {
        const printLocList: PrintLocationList[] = [];
        if (printingLocationLabels === LocationName.AISLE) {
          printLocList.push({
            locationId: selectedAisle.id,
            qty: signQty,
            printerMACAddress: selectedPrinter?.id || ''
          });
        } else {
          printLocList.push({
            locationId: selectedSection.id,
            qty: signQty,
            printerMACAddress: selectedPrinter?.id || ''
          });
        }
        trackEvent('print_section_label', {
          printItem: JSON.stringify(printLocList)
        });
        dispatch(printLocationLabel({ printLabelList: printLocList }));
      } else if (printingPalletLabel) {
        const printPalletList: PrintPalletList[] = [];
        printPalletList.push({
          palletId,
          qty: signQty,
          printerMACAddress: selectedPrinter?.id || ''
        });
        trackEvent('print_pallet', {
          printItem: JSON.stringify(printPalletList)
        });
        dispatch(printPalletLabel({ printPalletList }));
      } else {
        const printList: PrintItemList[] = [
          {
            itemNbr,
            qty: signQty,
            code: getPrinter(selectedPrinter, selectedSignType, countryCode),
            description: selectedSignType,
            printerMACAddress: selectedPrinter?.id || '',
            isPortablePrinter: selectedPrinter?.type === 1,
            workListTypeCode: exceptionType
          }
        ];
        trackEvent('print_price_sign', { printItem: JSON.stringify(printList) });
        dispatch(printSign({ printList }));
      }
    }).catch(() => {});
};

export const selectQuantityView = (
  setIsValidQty: React.Dispatch<React.SetStateAction<boolean>>,
  signQty: number,
  setSignQty: React.Dispatch<React.SetStateAction<number>>,
  isValidQty: boolean,
) => (
  <View style={styles.copyQtyContainer}>
    <Text style={styles.copyQtyLabel}>{strings('PRINT.COPY_QTY')}</Text>
    <View style={styles.qtyChangeContainer}>
      <IconButton
        icon={renderPlusMinusBtn('minus')}
        type={IconButtonType.SOLID_WHITE}
        backgroundColor={COLOR.GREY_400}
        height={30}
        width={30}
        radius={50}
        onPress={() => {
          setIsValidQty(true);
          setHandleDecreaseQty(signQty, setSignQty);
        }}
        testID="minusbutton"
      />
      <TextInput
        style={[styles.copyQtyInput, isValidQtyStyle(isValidQty)]}
        keyboardType="numeric"
        onChangeText={(text: string) => {
          const newQty: number = parseInt(text, 10);
          checkQuantity(newQty, setIsValidQty, setSignQty);
        }}
        testID="signQtyInput"
      >
        {signQty}
      </TextInput>
      <IconButton
        icon={renderPlusMinusBtn('plus')}
        type={IconButtonType.SOLID_WHITE}
        backgroundColor={COLOR.GREY_400}
        height={30}
        width={30}
        radius={50}
        onPress={() => {
          setIsValidQty(true);
          setHandleIncreaseQty(signQty, setSignQty);
        }}
        testID="plusbutton"
      />
    </View>
    {validateQuantity(isValidQty)}
  </View>
);

export const navListenerHook = (
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
  printingLocationLabels: string,
  printingPalletLabel: boolean
) => {
  // Resets Print api response data when navigating off-screen
  navigation.addListener('beforeRemove', () => {
    dispatch({ type: PRINT_SIGN.RESET });
    dispatch({ type: PRINT_LOCATION_LABELS.RESET });
    dispatch({ type: PRINT_PALLET_LABEL.RESET });
    if (printingLocationLabels) {
      dispatch(unsetPrintingLocationLabels());
    }
    if (printingPalletLabel) {
      dispatch(unsetPrintingPalletLabel());
    }
    dispatch(setPrintingType(null));
  });
  // set sign type to extra small when coming from loc mgmt screens
  navigation.addListener('focus', () => {
    if (printingLocationLabels) {
      dispatch(setSignType('XSmall'));
    }
  });
};

export const PrintPriceSignScreen = (props: PriceSignProps): JSX.Element => {
  const {
    scannedEvent, exceptionType, actionCompleted, itemResult, printAPI, printLabelAPI, printPalletAPI, countryCode,
    sectionsResult, selectedPrinter, selectedSignType, printQueue, printingLocationLabels, printingPalletLabel,
    selectedAisle, selectedSection, selectedZone, dispatch, navigation, route, signQty, palletInfo, locationPrintQueue,
    setSignQty, isValidQty, setIsValidQty, error, setError, useEffectHook, useLayoutHook, printerList, userConfig
  } = props;
  const itemDetailsResult = (isitemResultHasData(itemResult) as ItemDetails
  || getMockItemDetails(scannedEvent.value || ''));
  const {
    itemName, itemNbr, categoryNbr
  } = itemDetailsResult;
  const sectionsList: SectionItem[] = (sectionsResult && sectionsResult.data) || [];

  const getLocationName = () => (printingLocationLabels === LocationName.AISLE
    ? `${strings('LOCATION.AISLE')} ${selectedZone.name}${selectedAisle.name}`
    : `${strings(LOCATION_SECTION)} ${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`);

  const getFullSectionName = (sectionName: string) => (
    `${strings(LOCATION_SECTION)} ${selectedZone.name}${selectedAisle.name}-${sectionName}`);

  useLayoutHook(() => setPrinterLayoutHook(
    printerList,
    selectedPrinter,
    dispatch,
    printingPalletLabel,
    printingLocationLabels
  ), []);

  // Navigation Listener
  useEffectHook(() => navListenerHook(navigation, dispatch, printingLocationLabels, printingPalletLabel), []);

  // Print Sign API
  useEffectHook(() => printSignApiHook(
    printAPI,
    navigation,
    setError,
    dispatch,
    actionCompleted,
    exceptionType,
    route
  ), [printAPI]);

  // Print Label API
  useEffectHook(() => printLocationApiHook(
    printLabelAPI,
    navigation,
    setError
  ), [printLabelAPI]);

  // Print Pallet API
  useEffectHook(() => printPalletApiHook(
    printPalletAPI,
    navigation,
    setError
  ), [printPalletAPI]);

  const detailsView = () => (!printingLocationLabels
    // Item details view
    ? (
      <View style={styles.detailsContainer}>
        <Text style={styles.itemNameTxt}>{itemName}</Text>
      </View>
    )
    // Section details view
    : (
      <View style={styles.detailsContainer}>
        <Text>
          {printingLocationLabels === LocationName.AISLE
            ? `${strings('LOCATION.AISLE')} ${selectedZone.name}${selectedAisle.name} (${sectionsList.length} `
            + `${sectionsList.length === 1 ? strings(LOCATION_SECTION) : strings('LOCATION.SECTIONS')})`
            : `${strings(LOCATION_SECTION)} ${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`}
        </Text>
      </View>
    )
  );

  const sizeView = () => (!printingLocationLabels
    ? (
      <View style={styles.signSizeContainer}>
        <Text style={styles.signSizeLabel}>{strings('PRINT.SIGN_SIZE')}</Text>
        {renderSignSizeButtons(selectedPrinter, categoryNbr, selectedSignType, dispatch, countryCode)}
      </View>
    )
    : null
  );

  // eslint-disable-next-line arrow-body-style
  const printerView = () => (
    (printingLocationLabels || printingPalletLabel) && selectedPrinter?.type !== PrinterType.PORTABLE
      ? (
        <View style={styles.printerContainer}>
          <Text>{strings('PRINT.PLEASE_CHOOSE_PORTABLE')}</Text>
          <Button
            title={strings('GENERICS.CHANGE')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            titleFontSize={14}
            type={ButtonType.NO_BORDER}
            height={20}
            onPress={() => handleChangePrinter(navigation, route)}
          />
        </View>
      )
      : (
        <View style={styles.printerContainer}>
          <View style={styles.printerNameContainer}>
            <MaterialCommunityIcon name="printer-check" size={24} />
            <View style={styles.printTextMargin}>
              <Text>{selectedPrinter?.name || strings('PRINT.PRINTER_NOT_ASSIGNED')}</Text>
              <Text style={styles.printerDesc}>{selectedPrinter?.desc}</Text>
            </View>
          </View>
          <Button
            title={strings('GENERICS.CHANGE')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            titleFontSize={14}
            type={ButtonType.NO_BORDER}
            height={20}
            onPress={() => handleChangePrinter(navigation, route)}
            style={styles.changeButton}
          />
        </View>
      )
  );

  const disablePrint = () => {
    if (printingPalletLabel || printingLocationLabels) {
      return selectedPrinter?.type !== PrinterType.PORTABLE;
    }
    return isAddtoQueueDisabled(isValidQty, selectedSignType) || !selectedPrinter;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      { printingPalletLabel ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {printerView()}
          {isErrorRequired(error)}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {detailsView()}
          {selectQuantityView(setIsValidQty, signQty, setSignQty, isValidQty)}
          {sizeView()}
          {printerView()}
          {isErrorRequired(error)}
        </ScrollView>
      )}
      {printAPI.isWaiting || printLabelAPI.isWaiting || printPalletAPI.isWaiting ? (
        <View style={styles.footerBtnContainer}>
          <ActivityIndicator
            animating={printAPI.isWaiting || printLabelAPI.isWaiting || printPalletAPI.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      ) : (
        <View style={styles.footerBtnContainer}>
          {(userConfig.printingUpdate && !(printingPalletLabel))
          && (
          <Button
            title={strings('PRINT.ADD_TO_QUEUE')}
            type={ButtonType.PRIMARY}
            style={styles.footerBtn}
            onPress={() => handleAddPrintList(
              printQueue,
              locationPrintQueue,
              selectedSignType,
              itemDetailsResult,
              signQty,
              exceptionType,
              selectedSection,
              actionCompleted,
              selectedAisle,
              printingLocationLabels,
              getLocationName(),
              navigation,
              dispatch,
            )}
            disabled={isAddtoQueueDisabled(isValidQty, selectedSignType)}
          />
          )}
          <Button
            title={strings('PRINT.PRINT')}
            type={ButtonType.PRIMARY}
            style={styles.footerBtn}
            onPress={() => handlePrint(
              navigation,
              route,
              dispatch,
              printingLocationLabels,
              selectedAisle,
              signQty,
              selectedPrinter,
              selectedSection,
              printingPalletLabel,
              parseInt(palletInfo.id, 10),
              itemNbr,
              selectedSignType,
              exceptionType,
              countryCode
            )}
            disabled={disablePrint()}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const PrintPriceSign = (): JSX.Element => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const { exceptionType, actionCompleted } = useTypedSelector(state => state.ItemDetailScreen);
  const { result: itemResultV4 } = useTypedSelector(state => state.async.getItemDetailsV4);
  const printAPI = useTypedSelector(state => state.async.printSign);
  const { result: sectionsResult } = useTypedSelector(state => state.async.getSections);
  const printLabelAPI = useTypedSelector(state => state.async.printLocationLabels);
  const printPalletAPI = useTypedSelector(state => state.async.printPalletLabel);
  const { palletInfo } = useTypedSelector(state => state.PalletManagement);
  const userConfig = useTypedSelector(state => state.User.configs);
  const countryCode = useTypedSelector(state => state.User.countryCode);
  const {
    selectedSignType, printQueue, printingLocationLabels, printerList, locationPrintQueue,
    printingPalletLabel, priceLabelPrinter, locationLabelPrinter, palletLabelPrinter
  } = useTypedSelector(state => state.Print);
  const { selectedAisle, selectedSection, selectedZone } = useTypedSelector(state => state.Location);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [signQty, setSignQty] = useState(1);
  const [isValidQty, setIsValidQty] = useState(true);
  const [error, setError] = useState({ error: false, message: '' });

  const getSelectedPrinterBasedOnLabel = () => {
    if (printingLocationLabels) {
      return locationLabelPrinter;
    } if (printingPalletLabel) {
      return palletLabelPrinter;
    }
    return priceLabelPrinter;
  };

  return (
    <PrintPriceSignScreen
      scannedEvent={scannedEvent}
      exceptionType={exceptionType ?? ''}
      actionCompleted={actionCompleted}
      itemResult={itemResultV4}
      printAPI={printAPI}
      printLabelAPI={printLabelAPI}
      printPalletAPI={printPalletAPI}
      sectionsResult={sectionsResult}
      selectedPrinter={getSelectedPrinterBasedOnLabel()}
      selectedSignType={selectedSignType}
      printQueue={printQueue}
      locationPrintQueue={locationPrintQueue}
      printingLocationLabels={printingLocationLabels}
      printingPalletLabel={printingPalletLabel}
      selectedAisle={selectedAisle}
      selectedSection={selectedSection}
      selectedZone={selectedZone}
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
      palletInfo={palletInfo}
      printerList={printerList}
      userConfig={userConfig}
      countryCode={countryCode}
    />
  );
};
export default PrintPriceSign;
