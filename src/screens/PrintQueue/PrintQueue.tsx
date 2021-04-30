import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  NavigationProp, Route, useNavigation, useRoute
} from '@react-navigation/native';
import {
  ActivityIndicator, Image, Modal, SafeAreaView, ScrollView, Text, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { Dispatch } from 'redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import {
  LaserPaper, PrintQueueItem, Printer
} from '../../models/Printer';
import styles from './PrintQueue.styles';
import { strings } from '../../locales';
import { setPrintQueue } from '../../state/actions/Print';
import { printSign } from '../../state/actions/saga';
import IconButton from '../../components/buttons/IconButton';
import COLOR from '../../themes/Color';
import PrintQueueEdit from '../../components/printqueueedit/PrintQueueEdit';
import Button from '../../components/buttons/Button';

export const PrintQueue = () => {
  const { printQueue, selectedPrinter } = useTypedSelector(state => state.Print);
  const printAPI = useTypedSelector(state => state.async.printSign);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [itemIndexToEdit, setItemIndexToEdit] = useState(-1);
  const [apiInProgress, setAPIInProgress] = useState(false);
  const [error, setError] = useState({ error: false, message: '' });
  const [apiStart, setApiStart] = useState(0);

  return (
    <PrintQueueScreen
      printQueue={printQueue}
      selectedPrinter={selectedPrinter}
      printAPI={printAPI}
      dispatch={dispatch}
      navigation={navigation}
      route={route}
      itemIndexToEdit={itemIndexToEdit}
      setItemIndexToEdit={setItemIndexToEdit}
      apiInProgress={apiInProgress}
      setAPIInProgress={setAPIInProgress}
      error={error}
      setError={setError}
      apiStart={apiStart}
      setApiStart={setApiStart}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
      useEffectHook={useEffect}
    />
  );
};

interface HandlePrintProps {
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: Route<any>;
  printQueue: PrintQueueItem[];
  selectedPrinter: Printer;
  setApiStart: Function;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: any, route?: string) => Promise<void>;
}
interface PrintQueueScreenProps {
  printQueue: PrintQueueItem[];
  selectedPrinter: Printer;
  printAPI: {
    isWaiting: boolean;
    value: any;
    error: any;
    result: any;
  };
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: Route<any>;
  itemIndexToEdit: number;
  setItemIndexToEdit: Function;
  apiInProgress: boolean; setAPIInProgress: Function;
  error: { error: boolean; message: string };
  setError: Function;
  apiStart: number; setApiStart: Function;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: any, route?: string) => Promise<void>;
  useEffectHook: Function;
};

export const renderPrintItem = (
  printQueue: PrintQueueItem[],
  setItemIndexToEdit: Function,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  route: Route<any>,
  validateSessionCall: Function
) => {
  const handleEditAction = (index: number) => () => {
    setItemIndexToEdit(index);
  };

  const handleDeleteAction = (index: number) => () => {
    validateSessionCall(navigation, route.name).then(() => {
      trackEvent('print_queue_delete_item', { printItem: JSON.stringify(printQueue[index]) });
      printQueue.splice(index, 1);
      dispatch(setPrintQueue(printQueue));
    }).catch(() => {});
  };

  return printQueue.map((item, index) => (
    <View
      key={`${item.itemNbr}-${item.upcNbr}`}
      style={[styles.itemContainer, index < printQueue.length - 1 ? styles.itemContainerBorder : {}]}
    >
      <Image source={require('../../assets/images/sams_logo.jpeg')} style={styles.itemImage} />
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemDescText}>{item.itemName}</Text>
        <Text style={styles.sizeText}>{`${strings('PRINT.SIGN_SIZE')}: ${strings(`PRINT.${item.paperSize}`)}`}</Text>
        <View style={styles.itemBottomRowContainer}>
          <Text style={styles.copiesText}>{`${strings('PRINT.COPIES')}: ${item.signQty}`}</Text>
          <View style={styles.actionBtnContainer}>
            <IconButton
              icon={<MaterialCommunityIcon name="pencil" color={COLOR.GREY_700} size={22} />}
              type={IconButton.Type.NO_BORDER}
              style={styles.actionBtns}
              onPress={handleEditAction(index)}
            />
            <IconButton
              icon={<MaterialCommunityIcon name="delete" color={COLOR.GREY_700} size={22} />}
              type={IconButton.Type.NO_BORDER}
              style={styles.actionBtns}
              onPress={handleDeleteAction(index)}
            />
          </View>
        </View>
      </View>
    </View>
  ));
};

export const handlePrint = (props: HandlePrintProps) => {
  const {
    validateSessionCall,
    navigation,
    route,
    printQueue,
    selectedPrinter,
    setApiStart,
    trackEventCall,
    dispatch
  } = props;
  validateSessionCall(navigation, route.name).then(() => {
    const printArray = printQueue.map((printItem: PrintQueueItem) => {
      const {
        itemNbr, signQty, paperSize, worklistType
      } = printItem;
      return {
        itemNbr,
        qty: signQty,
        // @ts-ignore
        code: LaserPaper[paperSize],
        description: paperSize,
        printerMACAddress: selectedPrinter.id,
        isPortablePrinter: false,
        workListTypeCode: worklistType
      };
    });
    setApiStart(moment().valueOf());
    trackEventCall('print_queue', { queue: JSON.stringify(printArray) });
    dispatch(printSign({
      printlist: printArray
    }));
  }).catch(() => {});
};

export const PrintQueueScreen = (
  props: PrintQueueScreenProps
) => {
  const {
    printQueue,
    selectedPrinter,
    printAPI,
    dispatch,
    navigation,
    route,
    itemIndexToEdit,
    setItemIndexToEdit,
    apiInProgress, setAPIInProgress,
    error, setError,
    apiStart,
    setApiStart,
    trackEventCall,
    validateSessionCall,
    useEffectHook
  } = props;
  // Print API (Queue)
  useEffectHook(() => {
    // on api success
    if (apiInProgress && printAPI.isWaiting === false && printAPI.result) {
      trackEventCall('print_queue_api_success', { duration: moment().valueOf() - apiStart });
      setAPIInProgress(false);
      dispatch(setPrintQueue([]));
      navigation.goBack();
      return undefined;
    }

    // on api failure
    if (apiInProgress && printAPI.isWaiting === false && printAPI.error) {
      trackEventCall('print_queue_api_failure', {
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

  return (printQueue.length === 0
    ? (
      <View style={styles.emptyContainer}>
        <IconButton
          icon={<MaterialCommunityIcon name="printer" color={COLOR.GREY_500} size={100} />}
          type={IconButton.Type.PRIMARY}
          backgroundColor={COLOR.GREY_200}
          height={250}
          width={250}
          radius={250}
          style={styles.emptyImage}
          disabled
        />
        <Text style={styles.emptyText}>{strings('PRINT.EMPTY_LIST')}</Text>
      </View>
    )
    : (
      <SafeAreaView style={styles.safeAreaView}>
        <Modal
          visible={itemIndexToEdit >= 0}
          onRequestClose={() => {
            setItemIndexToEdit(-1);
          }}
          transparent
        >
          <PrintQueueEdit itemIndexToEdit={itemIndexToEdit} setItemIndexToEdit={setItemIndexToEdit} />
        </Modal>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.totalCountContainer}>
            <Text>{`${printQueue.length} ${strings('PRINT.TOTAL_ITEMS')}`}</Text>
          </View>
          <View style={styles.listContainer}>
            {renderPrintItem(printQueue, setItemIndexToEdit, dispatch, navigation, route, validateSession)}
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
              title={strings('PRINT.PRINT_ALL')}
              type={Button.Type.PRIMARY}
              style={styles.footerBtn}
              onPress={() => handlePrint({
                dispatch,
                navigation,
                selectedPrinter,
                printQueue,
                route,
                setApiStart,
                trackEventCall,
                validateSessionCall
              })}
              disabled={printQueue.length < 1}
            />
          </View>
        )}
      </SafeAreaView>
    )
  );
};
export default PrintQueue;
