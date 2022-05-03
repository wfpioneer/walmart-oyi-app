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
  showPicker: boolean;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
  onDateChange(event: DateTimePickerEvent, value: Date| undefined): void;
}

export const PalletExpiration = (props: PalletExpirationProps): JSX.Element => {
  const {
    dateChanged,
    dateRemoved,
    expirationDate,
    newExpirationDate,
    onDateChange,
    showPicker,
    setShowPicker
  } = props;

  const getDateValue = (expirationDate: string | undefined, newExpirationDate: string | undefined): Date =>
    newExpirationDate ? new Date(newExpirationDate) : (expirationDate ? new Date(expirationDate) : new Date(Date.now()));

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
          minimumDate={new Date(Date.now())}
          onChange={onDateChange}
          testID="datePicker"
        />
      )}
    </View>
  )
};

export default PalletExpiration;