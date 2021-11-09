import React, {
  Dispatch,
  useEffect,
  useState
} from 'react';

import {
  ActivityIndicator, Text, TextInput, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import styles from './OHQtyUpdate.style';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import IconButton from '../buttons/IconButton';
import { numbers, strings } from '../../locales';
import { updateOHQty } from '../../state/actions/saga';
import { setActionCompleted, updatePendingOHQty } from '../../state/actions/ItemDetailScreen';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import ItemDetails from '../../models/ItemDetails';
import { approvalRequestSource } from '../../models/ApprovalListItem';
import { ModalCloseIcon } from '../../screens/Modal/Modal';

interface OHQtyUpdateProps {
  ohQty: number;
  setOhQtyModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  exceptionType?: string; // eslint-disable-line react/require-default-props
  // eslint disabled above because the absence of this prop is used as an evaluator.
}

const OH_MIN = 0;
const OH_MAX = 9999;
const ERROR_FORMATTING_OPTIONS = {
  min: OH_MIN,
  max: numbers(OH_MAX, { precision: 0 })
};

const validateQty = (qty: number) => OH_MIN <= qty && qty <= OH_MAX;
const validateSameQty = (qty: number, newQty: number) => qty === newQty;

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);
const validateExceptionType = (exceptionType: any) => exceptionType === 'NO'
        || exceptionType === 'C' || exceptionType === 'NSFL';

const validate = (isValidNbr: any, isSameQty: any) => !isValidNbr || isSameQty;

const renderView = (isValidNbr: any) => (isValidNbr ? styles.updateContainerValid
  : styles.updateContainerInvalid);

const isValidNbrErrorRequired = (isValidNbr: any) => (
  !isValidNbr && (
    <Text style={styles.invalidLabel}>
      {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
    </Text>
  )
);
const isErrorRequired = (error: any) => (
  error !== '' && (
    <Text style={styles.invalidLabel}>
      {error}
    </Text>
  )
);
const OHQtyUpdate = (props: OHQtyUpdateProps): JSX.Element => {
  const { ohQty, setOhQtyModalVisible } = props;
  const [isValidNbr, setIsValidNbr] = useState(validateQty(ohQty));
  const [newOHQty, setNewOHQty] = useState(ohQty);
  const [isSameQty, setIsSameQty] = useState(validateSameQty(ohQty, newOHQty));
  const [apiSubmitting, updateApiSubmitting] = useState(false);
  const [error, updateError] = useState('');
  const { result } = useTypedSelector(state => state.async.getItemDetails);
  const itemDetails: ItemDetails = result.data;
  const updateQuantityAPIStatus = useTypedSelector(state => state.async.updateOHQty);
  const dispatch = useDispatch();
  // Update Quantity API
  useEffect(() => {
    // on api success
    dispatch(updatePendingOHQty(newOHQty));
    // validateExceptionType(props.exceptionType, dispatch);
    if (validateExceptionType(props.exceptionType)) {
      dispatch(setActionCompleted());
    }
    updateApiSubmitting(false);
    return setOhQtyModalVisible(false);
  }, [apiSubmitting && updateQuantityAPIStatus.isWaiting === false && updateQuantityAPIStatus.result]);

  useEffect(() => {
    updateApiSubmitting(false);
    return updateError(strings('ITEM.OH_UPDATE_API_ERROR'));
  }, [apiSubmitting && updateQuantityAPIStatus.isWaiting === false && updateQuantityAPIStatus.error]);

  useEffect(() => {
    // on api submission
    updateError('');
    return updateApiSubmitting(true);
  }, [!apiSubmitting && updateQuantityAPIStatus.isWaiting]);

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
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(newQty)) {
      setNewOHQty(newQty);
      setIsValidNbr(validateQty(newQty));
      setIsSameQty(validateSameQty(ohQty, newQty));
    }
  };

  const handleIncreaseQty = () => {
    if (newOHQty < OH_MIN) {
      setIsValidNbr(true);
      setNewOHQty(OH_MIN);
    } else if (newOHQty < OH_MAX) {
      setIsValidNbr(true);
      setNewOHQty((prevState => prevState + 1));
    }
    setIsSameQty(validateSameQty(ohQty, newOHQty + 1));
  };

  const handleDecreaseQty = () => {
    if (newOHQty > OH_MAX) {
      setIsValidNbr(true);
      setNewOHQty(OH_MAX);
    } else if (newOHQty > OH_MIN) {
      setIsValidNbr(true);
      setNewOHQty((prevState => prevState - 1));
    }
    setIsSameQty(validateSameQty(ohQty, newOHQty - 1));
  };

  return (
    <>
      <View style={styles.closeContainer}>
        {!apiSubmitting && (
          <IconButton
            icon={ModalCloseIcon}
            type={Button.Type.NO_BORDER}
            onPress={() => { setOhQtyModalVisible(false); }}
          />
        )}
      </View>
      <View style={[styles.updateContainer, renderView(isValidNbr)]}>
        <IconButton
          icon={renderPlusMinusBtn('minus')}
          type={IconButton.Type.NO_BORDER}
          height={15}
          width={35}
          onPress={handleDecreaseQty}
        />
        <TextInput
          style={styles.ohInput}
          keyboardType="numeric"
          onChangeText={handleTextChange}
        >
          {newOHQty}
        </TextInput>
        <IconButton
          icon={renderPlusMinusBtn('plus')}
          type={IconButton.Type.NO_BORDER}
          height={15}
          width={35}
          onPress={handleIncreaseQty}
        />
      </View>
      {isValidNbrErrorRequired(isValidNbr)}
      <Text style={styles.ohLabel}>
        {`${strings('GENERICS.TOTAL')} ${strings('ITEM.ON_HANDS')}`}
      </Text>
      {isErrorRequired(error)}
      {apiSubmitting ? (
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
            disabled={validate(isValidNbr, isSameQty)}
            onPress={handleSaveOHQty}
          />
        )}
    </>
  );
};

export default OHQtyUpdate;
