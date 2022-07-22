import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AxiosError } from 'axios';
import styles from './OHQtyUpdate.style';
import COLOR from '../../themes/Color';
import Button, { ButtonType } from '../buttons/Button';
import IconButton, { IconButtonType } from '../buttons/IconButton';
import NumericSelector from '../NumericSelector/NumericSelector';
import { numbers, strings } from '../../locales';
import { ModalCloseIcon } from '../../screens/Modal/Modal';

interface OHQtyUpdateProps {
  onHandsQty: number;
  newOHQty: number;
  isWaiting: boolean;
  error: AxiosError | null;
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit(): void;
  handleClose(): void;
}

const OH_MIN = 0;
const OH_MAX = 9999;
const ERROR_FORMATTING_OPTIONS = {
  min: OH_MIN,
  max: numbers(OH_MAX, { precision: 0 })
};

export const validateQty = (qty: number) => OH_MIN <= qty && qty <= OH_MAX;
export const validateSameQty = (qty: number, newQty: number) => qty === newQty;

export const calculateDecreaseQty = (newOHQty: any,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (newOHQty > OH_MAX) {
    setNewOHQty(OH_MAX);
  } else if (newOHQty > OH_MIN) {
    setNewOHQty((prevState => prevState - 1));
  }
};
export const assignHandleTextChange = (newQty: any,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>) => {
  setNewOHQty(newQty);
};

export const calculateIncreaseQty = (newOHQty: any,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (newOHQty < OH_MIN || typeof (newOHQty) !== 'number' || Number.isNaN(newOHQty)) {
    setNewOHQty(OH_MIN);
  } else if (newOHQty < OH_MAX) {
    setNewOHQty((prevState => prevState + 1));
  }
};

export const onQtyEditingEnd = (newOHQty: any, onHandsQty: number,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (typeof (newOHQty) !== 'number' || Number.isNaN(newOHQty)) {
    setNewOHQty(onHandsQty);
  }
};

const OHQtyUpdate = (props: OHQtyUpdateProps): JSX.Element => {
  const {
    onHandsQty, newOHQty, setNewOHQty,
    handleClose, handleSubmit, isWaiting, error
  } = props;

  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    assignHandleTextChange(newQty, setNewOHQty);
  };

  const handleIncreaseQty = () => {
    calculateIncreaseQty(newOHQty, setNewOHQty);
  };

  const handleDecreaseQty = () => {
    calculateDecreaseQty(newOHQty, setNewOHQty);
  };

  const handleEndEditingQty = () => {
    onQtyEditingEnd(newOHQty, onHandsQty, setNewOHQty);
  };

  return (
    <>
      <View style={styles.closeContainer}>
        {!isWaiting && (
          <IconButton
            testID="closeButton"
            icon={ModalCloseIcon}
            type={IconButtonType.NO_BORDER}
            onPress={handleClose}
          />
        )}
      </View>
      <NumericSelector
        testID="numericSelector"
        isValid={validateQty(newOHQty)}
        onDecreaseQty={handleDecreaseQty}
        onIncreaseQty={handleIncreaseQty}
        onTextChange={handleTextChange}
        minValue={OH_MIN}
        maxValue={OH_MAX}
        value={newOHQty}
        onEndEditing={handleEndEditingQty}
      />
      {!validateQty(newOHQty) && (
        <Text style={styles.invalidLabel}>
          {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
        </Text>
      )}
      <Text style={styles.ohLabel}>
        {`${strings('GENERICS.TOTAL')} ${strings('ITEM.ON_HANDS')}`}
      </Text>
      {error && (
        <Text style={styles.invalidLabel}>
          {strings('ITEM.OH_UPDATE_API_ERROR')}
        </Text>
      )}
      {isWaiting ? (
        <ActivityIndicator
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      )
        : (
          <Button
            testID="saveButton"
            style={styles.saveBtn}
            title="Save"
            type={ButtonType.PRIMARY}
            disabled={!validateQty(newOHQty) || validateSameQty(onHandsQty, newOHQty)}
            onPress={handleSubmit}
          />
        )}
    </>
  );
};

export default OHQtyUpdate;
