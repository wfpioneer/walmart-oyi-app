import React from 'react';
import { Switch, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from '../buttons/Button';
import IconButton from '../buttons/IconButton';
import NumericSelector from '../NumericSelector/NumericSelector';
import styles from './CreatePickDialog.style';
import { ModalCloseIcon } from '../../screens/Modal/Modal';
import { strings } from '../../locales';
import Location from '../../models/Location';
import { MOVE_TO_FRONT, PALLET_MAX, PALLET_MIN } from '../../screens/CreatePick/CreatePick';
import COLOR from '../../themes/Color';

interface CreatePickDialogProps {
  selectedSection: string;
  setSelectedSection: React.Dispatch<React.SetStateAction<string>>;
  numberOfPallets: number;
  setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>;
  isQuickPick: boolean;
  setIsQuickPick: React.Dispatch<React.SetStateAction<boolean>>;
  locations: Location[];
  onClose(): void;
  onSubmit(): void;
}

const addLocationsToPicker = (locations: Location[]) => [
  <Picker.Item label={strings('PICKING.SELECT_LOCATION')} value="" key={-1} />,
  ...locations.map((location: Location) => (
    <Picker.Item label={location.locationName} value={location.locationName} key={location.locationName} />
  )),
  <Picker.Item label={strings('PICKING.MOVE_TO_FRONT')} value={MOVE_TO_FRONT} key={MOVE_TO_FRONT} />
];

const onPalletIncrease = (
  numberOfPallets: number,
  setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
) => {
  if (numberOfPallets < PALLET_MAX) {
    setNumberOfPallets((preaviousState: number) => preaviousState + 1);
  }
};

const onPalletDecrease = (
  numberOfPallets: number,
  setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>
) => {
  if (numberOfPallets > PALLET_MIN) {
    setNumberOfPallets((preaviousState: number) => preaviousState - 1);
  }
};

const onPalletTextChange = (text: string, setNumberOfPallets: React.Dispatch<React.SetStateAction<number>>) => {
  const newQty = parseInt(text, 10);
  if (!Number.isNaN(newQty) && newQty >= PALLET_MIN && newQty <= PALLET_MAX) {
    setNumberOfPallets(newQty);
  }
};

const isNumberOfPalletsValid = (numberOfPallets: number) => (
  numberOfPallets >= PALLET_MIN && numberOfPallets <= PALLET_MAX
);

const onQuickPickChange = (setIsQuickPick: React.Dispatch<React.SetStateAction<boolean>>) => (
  setIsQuickPick((previousState: boolean) => !previousState)
);

export const CreatePickDialog = (props: CreatePickDialogProps): JSX.Element => {
  const {
    selectedSection,
    setSelectedSection,
    numberOfPallets,
    setNumberOfPallets,
    locations,
    onClose,
    isQuickPick,
    setIsQuickPick,
    onSubmit
  } = props;
  return (
    <View>
      <View style={styles.closeContainer}>
        <IconButton
          icon={ModalCloseIcon}
          type={Button.Type.NO_BORDER}
          onPress={() => onClose()}
          testID="closeButton"
        />
      </View>
      <Text style={styles.locationText}>
        {strings('PICKING.SELECT_LOCATION')}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSection}
          onValueChange={section => setSelectedSection(section)}
          mode="dropdown"
        >
          {addLocationsToPicker(locations)}
        </Picker>
      </View>
      {selectedSection ? (
        <View style={styles.numericSelectorContainer}>
          <Text>
            {strings('PICKING.NUMBER_PALLETS')}
          </Text>
          <NumericSelector
            isValid={isNumberOfPalletsValid(numberOfPallets)}
            onDecreaseQty={() => onPalletDecrease(numberOfPallets, setNumberOfPallets)}
            onIncreaseQty={() => onPalletIncrease(numberOfPallets, setNumberOfPallets)}
            onTextChange={(text: string) => onPalletTextChange(text, setNumberOfPallets)}
            minValue={PALLET_MIN}
            maxValue={PALLET_MAX}
            value={numberOfPallets}
          />
        </View>
      ) : null}
      <View style={styles.switchContainer}>
        <Text style={styles.quickPickText}>
          {strings('PICKING.QUICK_PICK')}
        </Text>
        <Switch
          value={isQuickPick}
          onValueChange={() => onQuickPickChange(setIsQuickPick)}
          thumbColor={COLOR.MAIN_THEME_COLOR}
          trackColor={{ false: COLOR.GREY, true: COLOR.MAIN_THEME_COLOR }}
          testID="quickPickSwitch"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={selectedSection === ''}
          title={strings('PICKING.CREATE_PICK')}
          type={Button.Type.PRIMARY}
          onPress={onSubmit}
          testID="submitButton"
        />
      </View>
    </View>
  );
};

export default CreatePickDialog;
