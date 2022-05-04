import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { strings } from '../../locales';
import styles from './PalletExpiration.style';

export interface PalletExpirationProps {
  dateChanged: boolean;
  dateRemoved: boolean;
  expirationDate: string | undefined;
  newExpirationDate: string | undefined;
  minimumDate: Date | undefined;
  showPicker: boolean;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
  onDateChange(event: DateTimePickerEvent, value: Date| undefined): void;
}

const getDateValue = (expirationDate: string | undefined, newExpirationDate: string | undefined): Date => {
  if (newExpirationDate) {
    return new Date(newExpirationDate)
  }

  if (expirationDate) {
    return new Date(expirationDate)
  }

  return new Date(Date.now());
};

export const PalletExpiration = (props: PalletExpirationProps): JSX.Element => {
  const {
    dateChanged,
    dateRemoved,
    expirationDate,
    newExpirationDate,
    minimumDate,
    onDateChange,
    showPicker,
    setShowPicker
  } = props;

  return (
    <View style={dateChanged ? styles.modifiedEffectiveDateContainer : styles.effectiveDateContainer}>
      <TouchableOpacity onPress={() => setShowPicker(true)} testID="openDate">
        <Text style={styles.headerText}>
          {strings('PALLET.EXPIRATION_DATE')}
        </Text>
        <Text style={(expirationDate || newExpirationDate || dateRemoved)
          ? styles.effectiveDateHeaderItem : styles.errorLabel}
        >
          {dateRemoved ? strings('GENERICS.REMOVED')
            : newExpirationDate || expirationDate || strings('GENERICS.REQUIRED')}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={getDateValue(expirationDate, newExpirationDate)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          minimumDate={minimumDate}
          onChange={onDateChange}
          testID="datePicker"
        />
      )}
    </View>
  )
};

export default PalletExpiration;
