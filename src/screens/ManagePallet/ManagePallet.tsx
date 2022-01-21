import React, {
  Dispatch,
  EffectCallback, useEffect, useMemo, useRef
} from 'react';
import {
  EmitterSubscription, FlatList, Text, TouchableOpacity, View
} from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import styles from './ManagePallet.style';
import { strings } from '../../locales';
import ManualScan from '../../components/manualscan/ManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import Button from '../../components/buttons/Button';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import { setPalletItemNewQuantity, showManagePalletMenu } from '../../state/actions/PalletManagement';
import PalletItemCard from '../../components/PalletItemCard/PalletItemCard';

interface ManagePalletProps {
  dispatch: Dispatch<any>;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
  palletInfo: PalletInfo;
  items: PalletItem[];
}

const getNumberOfDeleted = (items: PalletItem[]): number => items.reduce(
  (previousValue, currentValue) => previousValue + +currentValue.deleted, 0
);

const isQuantityChanged = (item: PalletItem): boolean => !!(item.newQuantity && item.newQuantity !== item.quantity);

const enableSave = (items: PalletItem[]): boolean => {
  const modifiedArray = items.filter((item: PalletItem) => isQuantityChanged(item)
    || item.deleted || item.added);
  return modifiedArray.length > 0;
};

const handleDecreaseQuantity = (item: PalletItem, dispatch: Dispatch<any>) => {
  const currentQuantity = item.newQuantity || item.quantity;
  if (currentQuantity === 1) {
    // TODO delete item flow
    // don't forget to ask user if want to delete
  } else {
    dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), currentQuantity - 1));
  }
};

const handleIncreaseQuantity = (item: PalletItem, dispatch: Dispatch<any>) => {
  const currentQuantity = item.newQuantity || item.quantity;
  dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), currentQuantity + 1));
};

const handleTextChange = (item: PalletItem, dispatch: Dispatch<any>, text: string) => {
  // have had issues with not putting 10 as radix with parseInt
  const newQuantity = Number.parseInt(text, 10);
  if (newQuantity === 0) {
    // TODO delete item flow
  } else if (newQuantity < 0) {
    Toast.show({
      type: 'error',
      text1: strings('PALLET.CANNOT_HAVE_NEGATIVE_QTY'),
      position: 'bottom',
      visibilityTime: 3000
    });
  } else {
    dispatch(setPalletItemNewQuantity(item.itemNbr.toString(), newQuantity));
  }
};

const itemCard = ({ item }: { item: PalletItem }, dispatch: Dispatch<any>) => {
  if (!item.deleted) {
    return (
      <PalletItemCard
        decreaseQuantity={() => handleDecreaseQuantity(item, dispatch)}
        increaseQuantity={() => handleIncreaseQuantity(item, dispatch)}
        onTextChange={text => handleTextChange(item, dispatch, text)}
        deleteItem={() => {}}
        isValid={true}
        itemName={item.itemDesc}
        itemNumber={item.itemNbr.toString()}
        markEdited={isQuantityChanged(item)}
        maxValue={99}
        minValue={0}
        numberOfItems={item.newQuantity || item.quantity}
        price={item.price}
        upc={item.upcNbr}
      />
    );
  }
  return null;
};

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const {
    dispatch, useEffectHook, isManualScanEnabled, palletInfo, items
  } = props;
  const { id, expirationDate } = palletInfo;
  let scannedSubscription: EmitterSubscription;
  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      // TODO implement scanning items and calling get item service
    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);
  return (
    <View style={styles.safeAreaView}>
      <View style={styles.bodyContainer}>
        {isManualScanEnabled && <ManualScan />}
        <View style={styles.headerContainer}>
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>
              {strings('PALLET.PALLET_ID')}
            </Text>
            <Text style={styles.headerItemText}>
              {id}
            </Text>
          </View>
          {expirationDate && expirationDate.length > 0 ? (
            <View style={styles.headerItem}>
              <Text style={styles.headerText}>
                {strings('PALLET.EXPIRATION_DATE')}
              </Text>
              <Text style={styles.headerItemText}>
                {expirationDate}
              </Text>
            </View>
          ) : null}
          <View style={styles.headerItem}>
            <Text style={styles.headerText}>
              {strings('LOCATION.ITEMS')}
            </Text>
            <Text style={styles.headerItemText}>
              {items.length}
            </Text>
          </View>
        </View>
        <View style={styles.instructionLabel}>
          <Text style={styles.instructionLabelText}>
            {strings('PALLET.SCAN_INSTRUCTIONS')}
          </Text>
        </View>
        {getNumberOfDeleted(items) > 0 ? (
          <View style={styles.deletedBanner}>
            <Text style={styles.deleteBannerText}>
              {getNumberOfDeleted(items) === 1 ? strings('PALLET.ITEM_DELETE')
                : strings('PALLET.X_ITEMS_DELETE', { nbrOfItems: getNumberOfDeleted(items) })}
            </Text>
          </View>
        ) : null}
        <View>
          <FlatList
            data={items}
            renderItem={item => itemCard(item, dispatch)}
            keyExtractor={(item: PalletItem) => item.upcNbr}
          />
        </View>
      </View>
      {enableSave(items) ? (
        <View style={styles.buttonContainer}>
          <Button
            title={strings('GENERICS.SAVE')}
            style={styles.saveButton}
            backgroundColor={COLOR.GREEN}
          />
        </View>
      ) : null}
    </View>
  );
};

const ManagePallet = (): JSX.Element => {
  const pallets = useTypedSelector(state => state.PalletManagement);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (pallets.managePalletMenu) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [pallets]);

  const handlePrintPallet = () => {
    dispatch(showManagePalletMenu(false));
    // TODO Integration
  };

  const handleCombinePallets = () => {
    dispatch(showManagePalletMenu(false));
    // TODO Integration
  };

  const handleClearPallet = () => {
    dispatch(showManagePalletMenu(false));
    // TODO Integration
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(showManagePalletMenu(false))}
        activeOpacity={1}
        disabled={!pallets.managePalletMenu}
        style={pallets.managePalletMenu ? styles.disabledContainer : styles.container}
      >
        <ManagePalletScreen
          dispatch={dispatch}
          useEffectHook={useEffect}
          isManualScanEnabled={isManualScanEnabled}
          palletInfo={pallets.palletInfo}
          items={pallets.items}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(showManagePalletMenu(false))}
        style={styles.bottomSheetModal}
      >
        <BottomSheetPrintCard
          isVisible={true}
          onPress={handlePrintPallet}
          text={strings('PALLET.PRINT_PALLET')}
        />
        <BottomSheetAddCard
          isManagerOption={false}
          isVisible={true}
          text={strings('PALLET.COMBINE_PALLETS')}
          onPress={handleCombinePallets}
        />
        <BottomSheetClearCard
          isManagerOption={false}
          isVisible={true}
          text={strings('PALLET.CLEAR_PALLET')}
          onPress={handleClearPallet}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default ManagePallet;
