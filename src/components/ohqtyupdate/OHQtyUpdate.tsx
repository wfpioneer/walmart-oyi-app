import React, { createRef, RefObject, useEffect, useState } from 'react';

import styles from './OHQtyUpdate.style';
import { View, Text, TextInput } from 'react-native';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from '../buttons/IconButton';
import { numbers, strings } from '../../locales';

interface OHQtyUpdateProps {
  ohQty: number,
  setOhQtyModalVisible: Function
}

const OH_MIN = 0;
const OH_MAX = 9999;
const ERROR_FORMATTING_OPTIONS = {
  min: OH_MIN,
  max: numbers(OH_MAX, {precision: 0})
};

const validateQty = (qty: number) => {
  return OH_MIN <= qty && qty <= OH_MAX;
}

const renderPlusMinusBtn = (name: 'plus' | 'minus') => {
  return (
    <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
  )
}

const OHQtyUpdate = (props: OHQtyUpdateProps) => {
  const {ohQty, setOhQtyModalVisible} = props;
  const [isValidNbr, setIsValidNbr] = useState(validateQty(ohQty));
  const [newOHQty, setNewOHQty] = useState(ohQty);

  const handleSaveOHQty = () => {
    // TODO call update OH service
    setOhQtyModalVisible(false);
    // TODO call get item details again... not sure how to do this right now. Maybe update OH should return it as the response?
  }

  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text);
    if(!isNaN(newQty)) {
      setNewOHQty(newQty);
      setIsValidNbr(validateQty(newQty));
    }
  }

  const handleIncreaseQty = () => {
    if (newOHQty < OH_MIN) {
      setIsValidNbr(true);
      setNewOHQty(OH_MIN);
    } else if (newOHQty < OH_MAX) {
      setIsValidNbr(true);
      setNewOHQty((prevState => prevState + 1));
    }
  }

  const handleDecreaseQty = () => {
    if (newOHQty > OH_MAX) {
      setIsValidNbr(true);
      setNewOHQty(OH_MAX);
    } else if (newOHQty > 0) {
      setIsValidNbr(true);
      setNewOHQty((prevState => prevState - 1));
    }
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.closeContainer}>
          <IconButton
            icon={<MaterialCommunityIcon name={'close'} size={16} color={COLOR.GREY_500} />}
            type={Button.Type.NO_BORDER}
            onPress={() => {setOhQtyModalVisible(false)}}
          />
        </View>
        <View style={[styles.updateContainer, isValidNbr ? styles.updateContainerValid : styles.updateContainerInvalid]}>
          <IconButton
            icon={renderPlusMinusBtn('minus')}
            type={IconButton.Type.NO_BORDER}
            height={15}
            width={35}
            onPress={handleDecreaseQty}
          />
          <TextInput
            style={styles.ohInput}
            keyboardType={'numeric'}
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
        {!isValidNbr && <Text style={styles.invalidLabel}>
          {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
        </Text>}
        <Text style={styles.ohLabel}>
          {`${strings('GENERICS.TOTAL')} ${strings('ITEM.ON_HANDS')}`}
        </Text>
        <Button
          style={styles.saveBtn}
          title={'Save'}
          type={Button.Type.PRIMARY}
          disabled={!isValidNbr}
          onPress={handleSaveOHQty}
        />
      </View>
    </View>
  );
}

export default OHQtyUpdate;
