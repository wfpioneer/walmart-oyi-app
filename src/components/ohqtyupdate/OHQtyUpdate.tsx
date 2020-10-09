import React, {
  useEffect,
  useState
} from 'react';

import {
  ActivityIndicator, Text, TextInput, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import styles from './OHQtyUpdate.style';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import IconButton from '../buttons/IconButton';
import { numbers, strings } from '../../locales';
import { updateOHQty } from '../../state/actions/saga';
import { updatePendingOHQty, setActionCompleted } from '../../state/actions/ItemDetailScreen';
import { useTypedSelector } from '../../state/reducers/RootReducer';

interface OHQtyUpdateProps {
  ohQty: number;
  setOhQtyModalVisible: Function;
  exceptionType?: string;
}

const OH_MIN = 0;
const OH_MAX = 9999;
const ERROR_FORMATTING_OPTIONS = {
  min: OH_MIN,
  max: numbers(OH_MAX, { precision: 0 })
};

const validateQty = (qty: number) => OH_MIN <= qty && qty <= OH_MAX;

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);

const OHQtyUpdate = (props: OHQtyUpdateProps) => {
  const { ohQty, setOhQtyModalVisible } = props;
  const [isValidNbr, setIsValidNbr] = useState(validateQty(ohQty));
  const [newOHQty, setNewOHQty] = useState(ohQty);
  const [apiSubmitting, updateApiSubmitting] = useState(false);
  const [error, updateError] = useState('');
  const { result } = useTypedSelector(state => state.async.getItemDetails);
  const { userId, siteId, countryCode } = useTypedSelector(state => state.User);
  const itemDetails = result && result.data;
  const updateQuantityAPIStatus = useTypedSelector(state => state.async.updateOHQty);
  const dispatch = useDispatch();

  useEffect(() => {
    // on api success
    if (apiSubmitting && updateQuantityAPIStatus.isWaiting === false && updateQuantityAPIStatus.result) {
      dispatch(updatePendingOHQty(newOHQty));
      if (props.exceptionType === "NO") {
        dispatch(setActionCompleted());
      }
      updateApiSubmitting(false);
      return setOhQtyModalVisible(false);
    }

    // on api failure
    if (apiSubmitting && updateQuantityAPIStatus.isWaiting === false && updateQuantityAPIStatus.error) {
      updateApiSubmitting(false);
      return updateError(strings('ITEM.OH_UPDATE_API_ERROR'));
    }

    // on api submission
    if (!apiSubmitting && updateQuantityAPIStatus.isWaiting) {
      updateError('');
      return updateApiSubmitting(true);
    }

    return undefined;
  }, [updateQuantityAPIStatus]);

  const handleSaveOHQty = () => {
    dispatch(updateOHQty({
      data: { onHandQty: newOHQty },
      itemNumber: itemDetails.itemNbr,
      headers: {
        userId,
        clubNbr: siteId,
        countryCode
      }
    }));
  };

  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(newQty)) {
      setNewOHQty(newQty);
      setIsValidNbr(validateQty(newQty));
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
  };

  const handleDecreaseQty = () => {
    if (newOHQty > OH_MAX) {
      setIsValidNbr(true);
      setNewOHQty(OH_MAX);
    } else if (newOHQty > OH_MIN) {
      setIsValidNbr(true);
      setNewOHQty((prevState => prevState - 1));
    }
  };

  if (apiSubmitting) {
    return (
      <View style={styles.modalContainer}>
        <ActivityIndicator color={COLOR.BLACK} />
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.closeContainer}>
          <IconButton
            icon={<MaterialCommunityIcon name="close" size={16} color={COLOR.GREY_500} />}
            type={Button.Type.NO_BORDER}
            onPress={() => { setOhQtyModalVisible(false); }}
          />
        </View>
        <View style={[styles.updateContainer, isValidNbr ? styles.updateContainerValid
          : styles.updateContainerInvalid]}
        >
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
        {!isValidNbr && (
        <Text style={styles.invalidLabel}>
          {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
        </Text>
        )}
        <Text style={styles.ohLabel}>
          {`${strings('GENERICS.TOTAL')} ${strings('ITEM.ON_HANDS')}`}
        </Text>
        {error !== '' && (
          <Text style={styles.invalidLabel}>
            {error}
          </Text>
        )}
        <Button
          style={styles.saveBtn}
          title="Save"
          type={Button.Type.PRIMARY}
          disabled={!isValidNbr}
          onPress={handleSaveOHQty}
        />
      </View>
    </View>
  );
};

export default OHQtyUpdate;
