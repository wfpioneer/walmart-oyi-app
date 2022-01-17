import React, {
  EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  EmitterSubscription, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import styles from './ManagePallet.style';
import { strings } from '../../locales';
import ManualScan from '../../components/manualscan/ManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';
import BottomSheetPrintCard from '../../components/BottomSheetPrintCard/BottomSheetPrintCard';
import BottomSheetAddCard from '../../components/BottomSheetAddCard/BottomSheetAddCard';
import BottomSheetClearCard from '../../components/BottomSheetClearCard/BottomSheetClearCard';
import { hidePalletPopup } from '../../state/actions/PalletManagement';

interface ManagePalletProps {
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  isManualScanEnabled: boolean;
}

export const ManagePalletScreen = (props: ManagePalletProps): JSX.Element => {
  const { useEffectHook, isManualScanEnabled } = props;
  let scannedSubscription: EmitterSubscription;
  // Scanner listener
  useEffectHook(() => {
    scannedSubscription = barcodeEmitter.addListener('scanned', scan => {

    });
    return () => {
      scannedSubscription.remove();
    };
  }, []);
  return (
    <View>
      {isManualScanEnabled && <ManualScan />}
    </View>
  );
};

const ManagePallet = (): JSX.Element => {
  const pallets = useTypedSelector(state => state.Pallets);
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
    // TODO Integration
  };

  const handleCombinePallets = () => {
    // TODO Integration
  };

  const handleClearPallet = () => {
    // TODO Integration
  };

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hidePalletPopup())}
        activeOpacity={1}
        disabled={!pallets.managePalletMenu}
        style={pallets.managePalletMenu ? styles.disabledContainer : styles.container}
      >
        <ManagePalletScreen
          useEffectHook={useEffect}
          isManualScanEnabled={isManualScanEnabled}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={() => dispatch(hidePalletPopup())}
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
          text={strings('LOCATION.CLEAR_PALLET')}
          onPress={handleClearPallet}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default ManagePallet;
