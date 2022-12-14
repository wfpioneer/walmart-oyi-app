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
    palletId?: number;
    quantity: number;
    locationType: string;
    onQtyIncrement(): void;
    onQtyDecrement(): void;
    onTextChange(text: string): void;
    onCalcPress(): void;
    onLocationDelete(): void;
    onEndEditing?: () => void;
    scannerEnabled: boolean;
    scanned?: boolean;
    showCalculator: boolean;
  }

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

export const validateQty = (qty: number, MIN: number, MAX: number) => MIN <= qty && qty <= MAX;

const LocationCard = (props: LocationCardProp): JSX.Element => {
  const {
    location,
    palletId,
    quantity,
    locationType,
    onQtyIncrement,
    onQtyDecrement,
    onLocationDelete,
    onTextChange,
    onEndEditing,
    scannerEnabled,
    scanned,
    onCalcPress,
    showCalculator
  } = props;

  const MIN = locationType === 'floor' ? 1 : 0;
  const MAX = 9999;
  const isValidQty = validateQty(quantity, MIN, MAX);
  return (
    <View style={styles.mainContainer}>
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
              {`${strings('LOCATION.PALLET')} ${palletId}`}
            </Text>
          </View>
          )}
        </View>
        <View style={showCalculator
          ? { ...styles.actionContainer, flex: 1.2, justifyContent: 'space-between' }
          : styles.actionContainer}
        >
          <View>
            <NumericSelector
              onDecreaseQty={onQtyDecrement}
              onIncreaseQty={onQtyIncrement}
              onTextChange={onTextChange}
              minValue={MIN}
              maxValue={MAX}
              value={quantity}
              isValid={isValidQty}
              onEndEditing={onEndEditing}
            />
          </View>
          {showCalculator && (
          <View style={styles.calculatorView}>
            <TouchableOpacity
              onPress={onCalcPress}
              testID="calc-button"
            >
              <View>
                <MaterialCommunityIcons name="calculator" size={30} color={COLOR.MAIN_THEME_COLOR} />
              </View>
            </TouchableOpacity>
          </View>
          )}
          <View>
            <TouchableOpacity onPress={() => { onLocationDelete(); }}>
              <MaterialCommunityIcons name="trash-can" size={30} color={COLOR.TRACKER_GREY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {!isValidQty && (
      <View>
        <Text style={styles.errorText}>{strings('GENERICS.NUMBER_MIN_MAX', { minimum: MIN, maximum: MAX })}</Text>
      </View>
      )}
    </View>
  );
};

LocationCard.defaultProps = {
  palletId: 0,
  scanned: false,
  onEndEditing: () => {}
};

export default LocationCard;
