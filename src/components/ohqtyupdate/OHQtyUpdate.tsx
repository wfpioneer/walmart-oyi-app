import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import styles from './OHQtyUpdate.style';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import IconButton from '../buttons/IconButton';
import NumericSelector from '../NumericSelector/NumericSelector';
import { numbers, strings } from '../../locales';
import { updateOHQty } from '../../state/actions/saga';
import { UPDATE_OH_QTY } from '../../state/actions/asyncAPI';
import { setActionCompleted, updatePendingOHQty } from '../../state/actions/ItemDetailScreen';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import ItemDetails from '../../models/ItemDetails';
import { approvalRequestSource } from '../../models/ApprovalListItem';
import { ModalCloseIcon } from '../../screens/Modal/Modal';

interface OHQtyUpdateProps {
  itemDetails: ItemDetails;
  setOhQtyModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const OH_MIN = 0;
const OH_MAX = 9999;
const ERROR_FORMATTING_OPTIONS = {
  min: OH_MIN,
  max: numbers(OH_MAX, { precision: 0 })
};

const validateQty = (qty: number) => OH_MIN <= qty && qty <= OH_MAX;
const validateSameQty = (qty: number, newQty: number) => qty === newQty;

const validateExceptionType = (exceptionType?: string) => exceptionType === 'NO'
  || exceptionType === 'C' || exceptionType === 'NSFL';

const validate = (isValidNbr: boolean, isSameQty: boolean) => !isValidNbr || isSameQty;

const calculateDecreaseQty = (newOHQty: any,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (newOHQty > OH_MAX) {
    setNewOHQty(OH_MAX);
  } else if (newOHQty > OH_MIN) {
    setNewOHQty((prevState => prevState - 1));
  }
};
const assignHandleTextChange = (newQty: any,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>) => {
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(newQty)) {
    setNewOHQty(newQty);
  }
};
const calculateIncreaseQty = (newOHQty: any,
  setNewOHQty: React.Dispatch<React.SetStateAction<number>>) => {
  if (newOHQty < OH_MIN) {
    setNewOHQty(OH_MIN);
  } else if (newOHQty < OH_MAX) {
    setNewOHQty((prevState => prevState + 1));
  }
};

const OHQtyUpdate = (props: OHQtyUpdateProps): JSX.Element => {
  const { itemDetails, setOhQtyModalVisible } = props;
  const { onHandsQty, exceptionType } = itemDetails;
  const [newOHQty, setNewOHQty] = useState(onHandsQty);
  const updateQuantityAPIStatus = useTypedSelector(state => state.async.updateOHQty);
  const dispatch = useDispatch();
  // Update Quantity API
  useEffect(() => {
    // on api success
    if (!updateQuantityAPIStatus.isWaiting && updateQuantityAPIStatus.result) {
      dispatch(updatePendingOHQty(newOHQty));
      if (validateExceptionType(exceptionType)) {
        dispatch(setActionCompleted());
      }
      dispatch({ type: UPDATE_OH_QTY.RESET });
      return setOhQtyModalVisible(false);
    }
    return undefined;
  }, [updateQuantityAPIStatus]);

  const handleSaveOHQty = () => {
    const {
      basePrice, categoryNbr, itemName, itemNbr, onHandsQty, upcNbr
    } = itemDetails;
    const change = basePrice * (newOHQty - itemDetails.onHandsQty);
    dispatch(updateOHQty({
      data: {
        itemName,
        itemNbr,
        upcNbr: parseInt(upcNbr, 10),
        categoryNbr,
        oldQuantity: onHandsQty,
        newQuantity: newOHQty,
        dollarChange: change,
        initiatedTimestamp: moment().toISOString(),
        approvalRequestSource: approvalRequestSource.ItemDetails
      }
    }));
  };

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

  return (
    <>
      <View style={styles.closeContainer}>
        {!updateQuantityAPIStatus.isWaiting && (
          <IconButton
            icon={ModalCloseIcon}
            type={Button.Type.NO_BORDER}
            onPress={() => {
              dispatch({ type: UPDATE_OH_QTY.RESET });
              setOhQtyModalVisible(false);
            }}
          />
        )}
      </View>
      <NumericSelector
        isValid={validateQty(newOHQty)}
        onDecreaseQty={handleDecreaseQty}
        onIncreaseQty={handleIncreaseQty}
        onTextChange={handleTextChange}
        minValue={OH_MIN}
        maxValue={OH_MAX}
        value={newOHQty}
      />
      {!validateQty(newOHQty) && (
        <Text style={styles.invalidLabel}>
          {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
        </Text>
      )}
      <Text style={styles.ohLabel}>
        {`${strings('GENERICS.TOTAL')} ${strings('ITEM.ON_HANDS')}`}
      </Text>
      {updateQuantityAPIStatus.error &&
      <Text style={styles.invalidLabel}>
        {strings('ITEM.OH_UPDATE_API_ERROR')}
      </Text>}
      {updateQuantityAPIStatus.isWaiting ? (
        <ActivityIndicator
          hidesWhenStopped
          color={COLOR.MAIN_THEME_COLOR}
          size="large"
          style={styles.activityIndicator}
        />
      )
        : (
          <Button
            style={styles.saveBtn}
            title="Save"
            type={Button.Type.PRIMARY}
            disabled={validate(validateQty(newOHQty), validateSameQty(onHandsQty, newOHQty))}
            onPress={handleSaveOHQty}
          />
        )}
    </>
  );
};

export default OHQtyUpdate;
