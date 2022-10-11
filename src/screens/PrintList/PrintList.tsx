import React, { EffectCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import Button, { ButtonType } from '../../components/buttons/Button';
import { strings } from '../../locales';
import styles from './PrintList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  PrintItemList, PrintLocationList, PrintQueueAPIMultistatus, PrintQueueItem, PrintQueueItemType,
  Printer, PrinterType, PrintingType
} from '../../models/Printer';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import { printLocationLabel, printSign } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import {
  clearLocationPrintQueue, removeMultipleFromPrintQueueByItemNbr, removeMultipleFromPrintQueueByUpc,
  setLocationPrintQueue,
  setPrintQueue, setPrintingType, unsetPrintingLocationLabels
} from '../../state/actions/Print';
import IconButton, { IconButtonType } from '../../components/buttons/IconButton';
import COLOR from '../../themes/Color';
import { PRINT_LOCATION_LABELS, PRINT_SIGN } from '../../state/actions/asyncAPI';
import PrintQueueItemCard from '../../components/PrintQueueItemCard/PrintQueueItemCard';
import { CustomModalComponent } from '../Modal/Modal';
import PrintQueueEdit from '../../components/printqueueedit/PrintQueueEdit';
import { getPaperSizeBasedOnCountry } from '../../utils/global';

export type PrintTab = 'PRICESIGN' | 'LOCATION';
interface PrintListProps {
  selectedPrinter: Printer | null;
  printQueue: PrintQueueItem[];
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  dispatch: Dispatch<any>;
  tabName: PrintTab;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  printAPI: AsyncState;
  printLocationAPI: AsyncState;
  printingLocationLabels: string;
  itemIndexToEdit: number;
  setItemIndexToEdit: React.Dispatch<React.SetStateAction<number>>;
  countryCode: string;
}

export const printItemApiEffect = (
  printAPI: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
): void => {
  if (!printAPI.isWaiting && printAPI.result) {
    if (printAPI.result.status === 207) {
      const { data } = printAPI.result;
      const succeededItemNbrs: number[] = [];
      const succeededUpcs: string[] = [];
      data.filter((item: PrintQueueAPIMultistatus) => item.completed)
        .forEach((item: PrintQueueAPIMultistatus) => {
          if (item.itemNbr) {
            succeededItemNbrs.push(item.itemNbr);
          } else {
            succeededUpcs.push(item.upcNbr);
          }
        });
      dispatch(removeMultipleFromPrintQueueByItemNbr(succeededItemNbrs));
      dispatch(removeMultipleFromPrintQueueByUpc(succeededUpcs));
      Toast.show({
        type: 'info',
        text1: strings('PRINT.SOME_PRINTS_FAILED'),
        visibilityTime: 4000,
        position: 'bottom'
      });
    } else {
      Toast.show({
        type: 'success',
        text1: strings('PRINT.PRICE_SIGN_SUCCESS'),
        visibilityTime: 4000,
        position: 'bottom'
      });
      dispatch(setPrintQueue([]));
      navigation.goBack();
    }
    return undefined;
  }

  // on api failure
  if (!printAPI.isWaiting && printAPI.error) {
    Toast.show({
      type: 'error',
      text1: strings('PRINT.PRINT_SERVICE_ERROR'),
      visibilityTime: 4000,
      position: 'bottom'
    });
  }

  return undefined;
};

export const locationLabelsApiEffect = (
  printLabelAPI: AsyncState,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
): void => {
  // on api success
  if (!printLabelAPI.isWaiting && printLabelAPI.result) {
    dispatch(clearLocationPrintQueue());
    Toast.show({
      type: 'success',
      text1: strings('PRINT.LOCATION_SUCCESS'),
      visibilityTime: 4000,
      position: 'bottom'
    });
    navigation.goBack();
  }
  // on api failure
  if (!printLabelAPI.isWaiting && printLabelAPI.error) {
    Toast.show({
      type: 'error',
      text1: strings('PRINT.PRINT_SERVICE_ERROR'),
      visibilityTime: 4000,
      position: 'bottom'
    });
  }
};

export const handleDeleteAction = (
  index: number,
  printQueue: PrintQueueItem[],
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>,
  dispatch: Dispatch<any>,
  queueName: PrintTab
) => (): void => {
  validateSession(navigation, route.name).then(() => {
    const newPrintQueue = printQueue;
    trackEvent('print_queue_delete_item', { printItem: JSON.stringify(printQueue[index]) });
    newPrintQueue.splice(index, 1);
    if (queueName === 'LOCATION') {
      dispatch(setLocationPrintQueue(newPrintQueue));
    } else {
      dispatch(setPrintQueue(newPrintQueue));
    }
  }).catch(() => {});
};

export const NoPrintQueueMessage = (): JSX.Element => (
  <View style={styles.emptyContainer}>
    <IconButton
      icon={<MaterialCommunityIcons name="printer" color={COLOR.GREY_500} size={100} />}
      type={IconButtonType.PRIMARY}
      backgroundColor={COLOR.GREY_200}
      height={250}
      width={250}
      radius={250}
      disabled
    />
    <Text style={styles.emptyText}>{strings('PRINT.EMPTY_LIST')}</Text>
  </View>
);
const handlePrint = (
  printQueue: PrintQueueItem[],
  tabName: PrintTab,
  selectedPrinterId: string | undefined,
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>,
  dispatch: Dispatch<any>,
  countryCode: string
): void => {
  validateSession(navigation, route.name).then(() => {
    if (tabName === 'LOCATION') {
      const printLocationArray: PrintLocationList[] = printQueue
        .filter(printLoc => printLoc.itemType !== PrintQueueItemType.ITEM)
        .map(printLabel => {
          const { locationId, signQty } = printLabel;
          return {
            locationId: locationId ?? 0,
            qty: signQty,
            printerMACAddress: selectedPrinterId || ''
          };
        });
      dispatch(printLocationLabel({ printLabelList: printLocationArray }));
    } else {
      const paperSizeObj = getPaperSizeBasedOnCountry(PrinterType.LASER, countryCode);
      const printArray: PrintItemList[] = printQueue
        .filter(printItem => printItem.itemType === PrintQueueItemType.ITEM)
        .map(printItem => {
          const {
            itemNbr, signQty, paperSize, worklistType
          } = printItem;
          return {
            itemNbr: itemNbr ?? 0,
            qty: signQty,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore needed because typechecking error
            code: paperSizeObj[paperSize],
            description: paperSize,
            printerMACAddress: selectedPrinterId || '',
            isPortablePrinter: false,
            workListTypeCode: worklistType ?? ''
          };
        });
      dispatch(printSign({ printList: printArray }));
    }
  }).catch(() => {});
};

export const handleChangePrinter = (
  tabName: PrintTab,
  navigation: NavigationProp<any>,
  route: RouteProp<any, string>,
  dispatch: Dispatch<any>
) => {
  const printingType = tabName === 'LOCATION' ? PrintingType.LOCATION : PrintingType.PRICE_SIGN;
  dispatch(setPrintingType(printingType));
  validateSession(navigation, route.name).then(() => {
    trackEvent('print_change_printer_click');
    navigation.navigate('PrinterList');
  }).catch(() => {});
};

export const PrintListsScreen = (props: PrintListProps): JSX.Element => {
  const {
    selectedPrinter, printQueue, navigation, route, dispatch, tabName, useEffectHook, countryCode,
    printAPI, printLocationAPI, printingLocationLabels, itemIndexToEdit, setItemIndexToEdit
  } = props;
  const queueLength = printQueue.length;

  // Navigation Listener
  useEffectHook(() => {
    // Resets Print api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: PRINT_SIGN.RESET });
      dispatch({ type: PRINT_LOCATION_LABELS.RESET });
      if (printingLocationLabels) {
        dispatch(unsetPrintingLocationLabels());
      }
    });
  }, []);
  // Print Price Sign API
  useEffectHook(() => printItemApiEffect(
    printAPI,
    dispatch,
    navigation,
  ), [printAPI]);

  // Print Location Label API
  useEffectHook(() => locationLabelsApiEffect(
    printLocationAPI,
    dispatch,
    navigation,
  ), [printLocationAPI]);

  return (
    <View style={styles.container}>
      <CustomModalComponent
        isVisible={itemIndexToEdit >= 0}
        onClose={() => {
          setItemIndexToEdit(-1);
        }}
        modalType="Form"
      >
        <PrintQueueEdit
          itemIndexToEdit={itemIndexToEdit}
          setItemIndexToEdit={setItemIndexToEdit}
          printQueue={printQueue}
          queueName={tabName}
          selectedPrinter={selectedPrinter}
          countryCode={countryCode}
        />
      </CustomModalComponent>
      {printQueue.length !== 0 && (
      <Text style={styles.itemText}>
        {`${queueLength} ${queueLength !== 1
          ? strings('GENERICS.ITEMS') : strings('GENERICS.ITEM')}`}
      </Text>
      )}
      <FlatList
        data={printQueue}
        keyExtractor={(item: PrintQueueItem) => item?.itemName + item?.paperSize}
        renderItem={({ item, index }) => (
          <PrintQueueItemCard
            jobName={item.itemName}
            nbrOfCopies={item.signQty}
            size={item.paperSize}
            editCallback={() => setItemIndexToEdit(index)}
            deleteCallback={handleDeleteAction(index, printQueue, navigation, route, dispatch, tabName)}
          />
        )}
        ListEmptyComponent={<NoPrintQueueMessage />}
      />
      {printAPI.isWaiting || printLocationAPI.isWaiting ? (
        <View style={styles.footerContainer}>
          <ActivityIndicator
            animating={printAPI.isWaiting || printLocationAPI.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <View style={styles.printerNameContainer}>
            <View style={styles.printTextPadding}>
              <MaterialCommunityIcons name="printer-check" size={24} />
              <Text style={styles.printerName}>{selectedPrinter?.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleChangePrinter(tabName, navigation, route, dispatch)}>
              <Text style={styles.changeButton}>{strings('GENERICS.CHANGE')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonView}>
            <Button
              title={strings('PRINT.PRINT')}
              type={ButtonType.PRIMARY}
              style={styles.footerBtn}
              onPress={() => handlePrint(
                printQueue, tabName, selectedPrinter?.id, navigation, route, dispatch, countryCode
              )}
              disabled={printQueue.length < 1}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const PrintLists = (props: {tab: PrintTab}): JSX.Element => {
  const {
    locationLabelPrinter, priceLabelPrinter, printingLocationLabels, locationPrintQueue, printQueue
  } = useTypedSelector(state => state.Print);
  const { printLocationLabels, printSign: printSignLabel } = useTypedSelector(state => state.async);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [itemIndexToEdit, setItemIndexToEdit] = useState(-1);
  const countryCode = useTypedSelector(state => state.User.countryCode);

  // Filter by tab
  const getSelectedPrinterBasedOnLabel = () => {
    if (props.tab === 'LOCATION') {
      return locationLabelPrinter;
    }
    return priceLabelPrinter;
  };
  return (
    <PrintListsScreen
      selectedPrinter={getSelectedPrinterBasedOnLabel()}
      printQueue={props.tab === 'PRICESIGN' ? printQueue : locationPrintQueue}
      navigation={navigation}
      route={route}
      dispatch={dispatch}
      tabName={props.tab}
      useEffectHook={useEffect}
      printAPI={printSignLabel}
      printLocationAPI={printLocationLabels}
      printingLocationLabels={printingLocationLabels}
      itemIndexToEdit={itemIndexToEdit}
      setItemIndexToEdit={setItemIndexToEdit}
      countryCode={countryCode}
    />
  );
};

export default PrintLists;
