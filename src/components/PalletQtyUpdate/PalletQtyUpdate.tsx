import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Button, { ButtonType } from '../buttons/Button';
import NumericSelector from '../NumericSelector/NumericSelector';
import { numbers, strings } from '../../locales';
import styles from './PalletQtyUpdate.style';
import COLOR from '../../themes/Color';

interface palletQtyUpdateProps {
  palletId: string;
  qty: number;
  handleSubmit: (newQty: number) => void;
  handleClose(): void;
}

const MIN_QTY = 0;
const MAX_QTY = 9999;
const ERROR_FORMATTING_OPTIONS = {
  min: MIN_QTY,
  max: numbers(MAX_QTY, { precision: 0 })
};

export const validateQty = (qty: number) => MIN_QTY <= qty && qty <= MAX_QTY;
export const validateSameQty = (qty: number, newQty: number) => qty === newQty;

export const calculateDecreaseQty = (newQty: any,
  setNewQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (newQty > MAX_QTY) {
    setNewQty(MAX_QTY);
  } else if (newQty > MIN_QTY) {
    setNewQty((prevState => prevState - 1));
  }
};
export const assignHandleTextChange = (newQty: any,
  setNewQty: React.Dispatch<React.SetStateAction<number>>) => {
  setNewQty(newQty);
};

export const calculateIncreaseQty = (newQty: any,
  setNewQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (newQty < MIN_QTY || typeof (newQty) !== 'number' || Number.isNaN(newQty)) {
    setNewQty(MIN_QTY);
  } else if (newQty < MAX_QTY) {
    setNewQty((prevState => prevState + 1));
  }
};

export const onQtyEditingEnd = (newQty: any, onHandsQty: number,
  setNewQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (typeof (newQty) !== 'number' || Number.isNaN(newQty)) {
    setNewQty(onHandsQty);
  }
};

const PalletQtyUpdate = (props: palletQtyUpdateProps): JSX.Element => {
  const {
    qty, palletId, handleSubmit, handleClose
  } = props;

  const [newQty, setNewQty] = useState(qty || 0);

  const handleTextChange = (text: string) => {
    const newQtyVal: number = parseInt(text, 10);
    assignHandleTextChange(newQtyVal, setNewQty);
  };

  const handleIncreaseQty = () => {
    calculateIncreaseQty(newQty, setNewQty);
  };

  const handleDecreaseQty = () => {
    calculateDecreaseQty(newQty, setNewQty);
  };

  const handleEndEditingQty = () => {
    onQtyEditingEnd(newQty, qty, setNewQty);
  };

  return (
    <>
      <View>
        <Text style={styles.titleLabel}>
          {`${strings('AUDITS.PALLET_COUNT')} ${palletId}`}
        </Text>
      </View>
      <NumericSelector
        testID="numericSelector"
        isValid={validateQty(newQty)}
        onDecreaseQty={handleDecreaseQty}
        onIncreaseQty={handleIncreaseQty}
        onTextChange={handleTextChange}
        minValue={MIN_QTY}
        maxValue={MAX_QTY}
        value={newQty}
        onEndEditing={handleEndEditingQty}
      />
      {!validateQty(newQty) && (
      <Text style={styles.invalidLabel}>
        {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
      </Text>
      )}
      <View style={styles.modalFooter}>
        <Button
          testID="cancelButton"
          style={styles.button}
          title={strings('GENERICS.CANCEL')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          type={ButtonType.SOLID_WHITE}
          onPress={handleClose}
        />
        <Button
          testID="confirmButton"
          title={strings('APPROVAL.CONFIRM')}
          style={styles.button}
          type={ButtonType.PRIMARY}
          disabled={!validateQty(newQty) || validateSameQty(qty, newQty)}
          onPress={() => handleSubmit(newQty)}
        />
      </View>
    </>
  );
};

export default PalletQtyUpdate;
