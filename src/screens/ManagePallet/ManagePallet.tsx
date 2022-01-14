import React, { EffectCallback, useEffect, useState } from 'react';
import { TouchableOpacity, TextInput, View, EmitterSubscription, Text } from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import styles from './ManagePallet.style';
import { strings } from '../../locales';
import ManualScan from '../../components/manualscan/ManualScan';
import { barcodeEmitter } from '../../utils/scannerUtils';

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
      {isManualScanEnabled && <ManualScan/>}
    </View>
  );
};

const ManagePallet = (): JSX.Element => {
  const isManualScanEnabled = useTypedSelector(state => state.Global.isManualScanEnabled);
  return (
    <ManagePalletScreen
      useEffectHook={useEffect}
      isManualScanEnabled={isManualScanEnabled}
    />
  );
};

export default ManagePallet;
