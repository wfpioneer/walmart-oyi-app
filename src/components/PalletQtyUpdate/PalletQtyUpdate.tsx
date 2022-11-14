import React from 'react';
import { Text, View } from 'react-native';
import Button, { ButtonType } from '../buttons/Button';
import NumericSelector from '../NumericSelector/NumericSelector';
import CustomNumericSelector from '../NumericSelector/CustomNumericSelector';
import { numbers, strings } from '../../locales';
import styles from './PalletQtyUpdate.style';
import COLOR from '../../themes/Color';
import CalculatorModal from '../CustomCalculatorModal/CalculatorModal';

interface palletQtyUpdateProps {
  palletId: number;
  qty: number;
  handleSubmit: (newQty: number) => void;
  handleClose(): void;
  showCalculator: boolean;
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
    qty, palletId, handleSubmit, handleClose, showCalculator
  } = props;

  const [newQty, setNewQty] = React.useState(qty || 0);
  const [calcOpen, setCalcOpen] = React.useState(false);

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

  const onCalcAccept = (value: string) => {
    assignHandleTextChange(value, setNewQty);
  };

  return (
    <>
      <CalculatorModal
        visible={calcOpen}
        onClose={() => setCalcOpen(false)}
        onAccept={onCalcAccept}
        disableAcceptButton={(value: string): boolean => {
          const calcValue = Number(value);
          return !(calcValue % 1 === 0 && calcValue >= 0);
        }}
        showAcceptButton={true}
      />
      <View>
        <Text style={styles.titleLabel}>
          {`${strings('AUDITS.PALLET_COUNT')} ${palletId}`}
        </Text>
      </View>
      {showCalculator
        ? (
          <CustomNumericSelector
            testID="numericSelector"
            isValid={validateQty(newQty)}
            onDecreaseQty={handleDecreaseQty}
            onIncreaseQty={handleIncreaseQty}
            minValue={MIN_QTY}
            maxValue={MAX_QTY}
            value={newQty}
            onInputPress={() => setCalcOpen(true)}
          />
        )
        : (
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
        )}
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
