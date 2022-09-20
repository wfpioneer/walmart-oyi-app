import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import NumericSelector from '../NumericSelector/NumericSelector';
import styles from './LocationCard.style';
import COLOR from '../../themes/Color';

interface LocationCardProp {
    location: string;
    palletID?: string;
    quantity: number;
    locationType: string;
    onQtyIncrement(): void;
    onQtyDecrement(): void;
    onTextChange(text: string): void;
    onLocationDelete(): void;
    onEndEditing?: () => void;
    scannerEnabled: boolean;
    scanned?: boolean;
  }

export const MAX = 9999;
export const MIN = 0;

export const getContentStyle = (
  locationType: string, scannerEnabled: boolean, scanned: boolean | undefined, isLocationText: boolean
) => {
  if (locationType === 'reserve' && scannerEnabled && scanned) {
    return isLocationText ? styles.locScanned : styles.palletScanned;
  }
  if (locationType === 'reserve' && scannerEnabled && !scanned) {
    return isLocationText ? styles.mandatoryLocScan : styles.mandatoryPalletScan;
  }
  return isLocationText ? styles.location : styles.pallet;
};

export const validateQty = (qty: number) => MIN <= qty && qty <= MAX;

const LocationCard = (props: LocationCardProp): JSX.Element => {
  const {
    location,
    palletID,
    quantity,
    locationType,
    onQtyIncrement,
    onQtyDecrement,
    onTextChange,
    onLocationDelete,
    onEndEditing,
    scannerEnabled,
    scanned
  } = props;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={getContentStyle(locationType, scannerEnabled, scanned, true)}>
            {location}
          </Text>
        </View>
        {locationType === 'reserve' && (
        <View>
          <Text style={getContentStyle(locationType, scannerEnabled, scanned, false)}>
            {`${strings('LOCATION.PALLET')} ${palletID}`}
          </Text>
        </View>
        )}
      </View>
      <View style={styles.actionContainer}>
        <View>
          <NumericSelector
            onDecreaseQty={onQtyDecrement}
            onIncreaseQty={onQtyIncrement}
            onTextChange={onTextChange}
            minValue={0}
            maxValue={MAX}
            value={quantity}
            isValid={validateQty(quantity)}
            onEndEditing={onEndEditing}
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => { onLocationDelete(); }}>
            <MaterialCommunityIcons name="trash-can" size={40} color={COLOR.TRACKER_GREY} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

LocationCard.defaultProps = {
  palletID: '',
  scanned: false,
  onEndEditing: () => {}
};

export default LocationCard;
