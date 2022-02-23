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
import Toast from 'react-native-toast-message';
import IconButton from '../../components/buttons/IconButton';
import Button from '../../components/buttons/Button';
import COLOR from '../../themes/Color';
import { numbers, strings } from '../../locales';
import styles from './PrintPriceSign.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { getMockItemDetails } from '../../mockData';
import {
  addLocationPrintQueue, addMultipleToLocationPrintQueue, addToPrintQueue, addToPrinterList,
  setPriceLabelPrinter, setSignType, unsetPrintingLocationLabels, unsetPrintingPalletLabel
} from '../../state/actions/Print';
import { setActionCompleted } from '../../state/actions/ItemDetailScreen';
import {
  LaserPaper, PortablePaper, PrintItemList, PrintLocationList,
  PrintPalletList, PrintPaperSize, PrintQueueItem, PrintQueueItemType, Printer, PrinterType
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
  selectedPrinter: Printer | null,
  catgNbr: number,
  signType: string,
  dispatch: Dispatch<any>
): JSX.Element => {
  const sizeObject = selectedPrinter?.type === PrinterType.LASER ? LaserPaper : PortablePaper;
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
  scannedEvent: { value: any; type: any };
  exceptionType: string;
  actionCompleted: boolean;
  itemResult: any;
  printAPI: AsyncState;
  printLabelAPI: AsyncState;
  printPalletAPI: AsyncState;
  sectionsResult: any;
  palletInfo: any;
  selectedPrinter: Printer | null;
  selectedSignType: PrintPaperSize;
  printQueue: PrintQueueItem[];
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
}

const getPrinter = (selectedPrinter: Printer | null, selectedSignType: PrintPaperSize) => (
  selectedPrinter?.type === PrinterType.LASER
  // @ts-ignore
    ? LaserPaper[selectedSignType] : PortablePaper[selectedSignType]);

const isValid = (actionCompleted: any, exceptionType: any) => !actionCompleted && exceptionType === 'PO';

const isItemSizeExists = (
  printQueue: PrintQueueItem[],
  selectedSignType: PrintPaperSize,
  itemNbr: number
) => printQueue.some(
  printItem => printItem.itemNbr === itemNbr && printItem.paperSize === selectedSignType
);

const aisleSectionExists = (printQueue: PrintQueueItem[], locationId: number) => printQueue
  .some(printLoc => printLoc.locationId === locationId);

const setHandleDecreaseQty = (
  signQty: number,
  setSignQty: React.Dispatch<React.SetStateAction<number>>
) => {
  if (signQty > QTY_MAX) {
    setSignQty(QTY_MAX);
  } else if (signQty > QTY_MIN) {
    setSignQty((prevState: number) => prevState - 1);
  }
};

const setHandleIncreaseQty = (
  signQty: number,
  setSignQty: React.Dispatch<React.SetStateAction<number>>
) => {
  if (signQty < QTY_MIN) {
    setSignQty(QTY_MIN);
  } else if (signQty < QTY_MAX) {
    setSignQty((prevState: number) => prevState + 1);
  }
};
const isErrorRequired = (error: { error: boolean; message: string }) => (error.error ? (
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

const checkQuantity = (
  newQty: number,
  setIsValidQty: React.Dispatch<React.SetStateAction<boolean>>,
  setSignQty: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!Number.isNaN(newQty)) {
    setSignQty(newQty);
    setIsValidQty(validateQty(newQty));
  }
};

const isValidDispatch = (
  props: PriceSignProps,
  actionCompleted: boolean,
  exceptionType: string
) => {
  const { dispatch } = props;
  if (isValid(actionCompleted, exceptionType)) {
    dispatch(setActionCompleted());
  }
};

const isitemResultHasData = (itemResult: any) => (
  (itemResult && itemResult.data)
);
export const PrintPriceSignScreen = (props: PriceSignProps): JSX.Element => {
  const {
    scannedEvent, exceptionType, actionCompleted, itemResult, printAPI, printLabelAPI, printPalletAPI,
    sectionsResult, selectedPrinter, selectedSignType, printQueue, printingLocationLabels, printingPalletLabel,
    selectedAisle, selectedSection, selectedZone, dispatch, navigation, route, signQty, palletInfo,
    setSignQty, isValidQty, setIsValidQty, error, setError, useEffectHook, useLayoutHook, printerList, userConfig
  } = props;
  const {
    itemName, itemNbr, upcNbr, categoryNbr
  } = isitemResultHasData(itemResult) as ItemDetails || getMockItemDetails(scannedEvent.value);
  const sectionsList: SectionItem[] = (sectionsResult && sectionsResult.data) || [];

  const getLocationName = () => (printingLocationLabels === LocationName.AISLE
    ? `${strings('LOCATION.AISLE')} ${selectedZone.name}${selectedAisle.name}`
    : `${strings('LOCATION.SECTION')} ${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`);

  const getFullSectionName = (sectionName: string) => (
    `${strings('LOCATION.SECTION')} ${selectedZone.name}${selectedAisle.name}-${sectionName}`);

  useLayoutHook(() => {
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
  }, []);

  // Navigation Listener
  useEffectHook(() => {
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
    });
    // set sign type to extra small when coming from loc mgmt screens
    navigation.addListener('focus', () => {
      if (printingLocationLabels) {
        dispatch(setSignType('XSmall'));
      }
    });
  }, []);

  // Print Sign API
  useEffectHook(() => {
    // on api success
    if (!printAPI.isWaiting && printAPI.result) {
      isValidDispatch(props, actionCompleted, exceptionType);
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
      setError({ error: true, message: strings('PRINT.PRINT_SERVICE_ERROR') });
    }
    // on api submission
    if (printLabelAPI.isWaiting) {
      setError({ error: false, message: '' });
    }
  }, [printLabelAPI]);

  // Print Pallet API
  useEffectHook(() => {
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
      setError({ error: true, message: strings('PRINT.PRINT_SERVICE_ERROR') });
    }
    // on api submission
    if (printPalletAPI.isWaiting) {
      setError({ error: false, message: '' });
    }
  }, [printPalletAPI]);

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
    }).catch(() => {});
  };

  const handleAddPrintList = () => {
    // check if the item/size already exists on the print queue
    const itemSizeExists = isItemSizeExists(printQueue, selectedSignType, itemNbr);
    // TODO Disable check on price sign screen and vice versa
    const locationLabelExists = aisleSectionExists(printQueue, selectedSection.id);

    // TODO Use LocationLabelCheck to allow some items to be added to the print queue
    if (itemSizeExists || locationLabelExists) {
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
        const printQueueItems: PrintQueueItem[] = [];
        // Add Get Sections response to print queue
        sectionsList.forEach(section => {
          const printQueueArrayItem: PrintQueueItem = {
            itemName: getFullSectionName(section.sectionName),
            locationId: section.sectionId,
            paperSize: selectedSignType,
            signQty,
            itemType: PrintQueueItemType.SECTION
          };
          printQueueItems.push(printQueueArrayItem);
        });
        trackEvent('print_add_to_loc_print_queue', { printQueueItem: JSON.stringify(printQueueItems) });
        dispatch(addMultipleToLocationPrintQueue(printQueueItems));
      } else {
        const { id } = selectedSection;
        printQueueItem = {
          itemName: getLocationName(),
          locationId: id,
          paperSize: selectedSignType,
          signQty,
          itemType: PrintQueueItemType.SECTION
        };
        trackEvent('print_add_to_loc_print_queue', { printQueueItem: JSON.stringify(printQueueItem) });
        dispatch(addLocationPrintQueue(printQueueItem));
      }
      isValidDispatch(props, actionCompleted, exceptionType);
      navigation.goBack();
    }
  };

  const handlePrint = () => {
    validateSession(navigation, route.name)
      .then(() => {
        if (printingLocationLabels) {
          const printLocList: PrintLocationList[] = [];
          if (printingLocationLabels === LocationName.AISLE) {
            // Add Get Sections response to print list body
            sectionsList.forEach(section => {
              const printQueueArrayItem: PrintLocationList = {
                locationId: section.sectionId,
                qty: signQty,
                printerMACAddress: selectedPrinter?.id || ''
              };
              printLocList.push(printQueueArrayItem);
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
            palletId: palletInfo.id,
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
              code: getPrinter(selectedPrinter, selectedSignType),
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
            + `${sectionsList.length === 1 ? strings('LOCATION.SECTION') : strings('LOCATION.SECTIONS')})`
            : `${strings('LOCATION.SECTION')} ${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`}
        </Text>
      </View>
    )
  );

  const sizeView = () => (!printingLocationLabels
    ? (
      <View style={styles.signSizeContainer}>
        <Text style={styles.signSizeLabel}>{strings('PRINT.SIGN_SIZE')}</Text>
        {renderSignSizeButtons(selectedPrinter, categoryNbr, selectedSignType, dispatch)}
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
            type={Button.Type.NO_BORDER}
            height={20}
            onPress={handleChangePrinter}
          />
        </View>
      )
      : (
        <View style={styles.printerContainer}>
          <View style={styles.printerNameContainer}>
            <MaterialCommunityIcon name="printer-check" size={24} />
            <View style={styles.printTextMargin}>
              <Text>{selectedPrinter?.name}</Text>
              <Text style={styles.printerDesc}>{selectedPrinter?.desc}</Text>
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
      )
  );

  const selectQuantityView = () => (
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
  );

  const disablePrint = () => {
    if (printingPalletLabel || printingLocationLabels) {
      return selectedPrinter?.type !== PrinterType.PORTABLE;
    }
    return isAddtoQueueDisabled(isValidQty, selectedSignType);
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
          {selectQuantityView()}
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
          {userConfig.printingUpdate && !printingPalletLabel
          && (
          <Button
            title={strings('PRINT.ADD_TO_QUEUE')}
            titleColor={COLOR.MAIN_THEME_COLOR}
            type={Button.Type.SOLID_WHITE}
            style={styles.footerBtn}
            onPress={handleAddPrintList}
            disabled={isAddtoQueueDisabled(isValidQty, selectedSignType)}
          />
          )}
          <Button
            title={strings('PRINT.PRINT')}
            type={Button.Type.PRIMARY}
            style={styles.footerBtn}
            onPress={handlePrint}
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
  const { result: itemResult } = useTypedSelector(state => state.async.getItemDetails);
  const printAPI = useTypedSelector(state => state.async.printSign);
  const { result: sectionsResult } = useTypedSelector(state => state.async.getSections);
  const printLabelAPI = useTypedSelector(state => state.async.printLocationLabels);
  const printPalletAPI = useTypedSelector(state => state.async.printPalletLabel);
  const { palletInfo } = useTypedSelector(state => state.PalletManagement);
  const userConfig = useTypedSelector(state => state.User.configs);
  const {
    selectedSignType, printQueue, printingLocationLabels, printerList,
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
      itemResult={itemResult}
      printAPI={printAPI}
      printLabelAPI={printLabelAPI}
      printPalletAPI={printPalletAPI}
      sectionsResult={sectionsResult}
      selectedPrinter={getSelectedPrinterBasedOnLabel()}
      selectedSignType={selectedSignType}
      printQueue={printQueue}
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
    />
  );
};
export default PrintPriceSign;
