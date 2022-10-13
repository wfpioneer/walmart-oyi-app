import React, { useState } from 'react';
import {
  Text, TextInput, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import IconButton, { IconButtonType } from '../buttons/IconButton';
import COLOR from '../../themes/Color';
import Button, { ButtonType } from '../buttons/Button';
import { numbers, strings } from '../../locales';
import styles from './PrintQueueEdit.style';
import { setLocationPrintQueue, setPrintQueue } from '../../state/actions/Print';
import { trackEvent } from '../../utils/AppCenterTool';
import { ModalCloseIcon } from '../../screens/Modal/Modal';
import { PrintTab } from '../../screens/PrintList/PrintList';
import { PrintPaperSize, PrintQueueItem, Printer } from '../../models/Printer';

import { getPaperSizeBasedOnCountry } from '../../utils/global';

const QTY_MIN = 1;
const QTY_MAX = 100;
const ERROR_FORMATTING_OPTIONS = {
  min: QTY_MIN,
  max: numbers(QTY_MAX, { precision: 0 })
};

const validateQty = (qty: number) => QTY_MIN <= qty && qty <= QTY_MAX;

const renderPlusMinusBtn = (name: 'plus' | 'minus') => (
  <MaterialCommunityIcon name={name} color={COLOR.MAIN_THEME_COLOR} size={18} />
);

const PrintQueueEdit = (props: {
  itemIndexToEdit: number;
  printQueue: PrintQueueItem[]
  setItemIndexToEdit: React.Dispatch<React.SetStateAction<number>>;
  queueName?: PrintTab
  selectedPrinter: Printer | null;
  countryCode: string;
}): JSX.Element => {
  const {
    itemIndexToEdit, printQueue, setItemIndexToEdit, queueName, selectedPrinter, countryCode
  } = props;
  const itemToEdit = printQueue[itemIndexToEdit];
  const dispatch = useDispatch();

  const [signQty, setSignQty] = useState<number>(itemToEdit.signQty);
  const [isValidQty, setIsValidQty] = useState(true);
  const [signSize, setSignSize] = useState<PrintPaperSize>(itemToEdit.paperSize);

  const handleTextChange = (text: string) => {
    const newQty: number = parseInt(text, 10);
    if (!isNaN(newQty)) { // eslint-disable-line no-restricted-globals
      // line rule disabled due to isNaN being necessary for this evaluation.
      setSignQty(newQty);
      setIsValidQty(validateQty(newQty));
    }
  };

  const handleIncreaseQty = () => {
    setIsValidQty(true);
    if (signQty < QTY_MIN) {
      setSignQty(QTY_MIN);
    } else if (signQty < QTY_MAX) {
      setSignQty((prevState => prevState + 1));
    }
  };

  const handleDecreaseQty = () => {
    setIsValidQty(true);
    if (signQty > QTY_MAX) {
      setSignQty(QTY_MAX);
    } else if (signQty > QTY_MIN) {
      setSignQty((prevState => prevState - 1));
    }
  };

  const handleSave = () => {
    trackEvent('print_queue_edit_save', { printItem: JSON.stringify(itemToEdit), newSignQty: signQty });
    printQueue.splice(itemIndexToEdit, 1, { ...itemToEdit, signQty, paperSize: signSize });
    if (queueName === 'LOCATION') {
      dispatch(setLocationPrintQueue(printQueue));
    } else {
      dispatch(setPrintQueue(printQueue));
    }
    setItemIndexToEdit(-1);
  };

  const addPaperSizesToPicker = (sizes: any) => [
    ...Object.keys(sizes).map(size => (
      <Picker.Item label={strings(`PRINT.${size}`)} value={size} key={size} />
    ))
  ];
  return (
    <>
      <View style={styles.closeContainer}>
        <IconButton
          icon={ModalCloseIcon}
          type={IconButtonType.NO_BORDER}
          onPress={() => setItemIndexToEdit(-1)}
        />
      </View>
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemNameTxt}>{itemToEdit.itemName}</Text>
      </View>
      <View style={styles.copyQtyContainer}>
        <Text style={styles.copyQtyLabel}>{strings('PRINT.COPY_QTY')}</Text>
        <View style={styles.qtyChangeContainer}>
          <IconButton
            icon={renderPlusMinusBtn('minus')}
            type={IconButtonType.SOLID_WHITE}
            backgroundColor={COLOR.GREY_400}
            height={30}
            width={30}
            radius={50}
            onPress={handleDecreaseQty}
          />
          <TextInput
            style={[styles.copyQtyInput, isValidQty ? styles.copyQtyInputValid : styles.copyQtyInputInvalid]}
            keyboardType="numeric"
            onChangeText={handleTextChange}
          >
            {signQty}
          </TextInput>
          <IconButton
            icon={renderPlusMinusBtn('plus')}
            type={IconButtonType.SOLID_WHITE}
            backgroundColor={COLOR.GREY_400}
            height={30}
            width={30}
            radius={50}
            onPress={handleIncreaseQty}
          />
        </View>
        {!isValidQty && (
        <Text style={styles.invalidLabel}>
          {strings('ITEM.OH_UPDATE_ERROR', ERROR_FORMATTING_OPTIONS)}
        </Text>
        )}
      </View>
      <View style={styles.signSizeContainer}>
        <Text style={styles.signSizeLabel}>{strings('PRINT.SIGN_SIZE')}</Text>
        {queueName === 'PRICESIGN'
          ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={signSize}
                onValueChange={(paperSize: PrintPaperSize) => setSignSize(paperSize)}
                mode="dropdown"
              >
                {addPaperSizesToPicker(getPaperSizeBasedOnCountry(selectedPrinter?.type, countryCode))}
              </Picker>

            </View>
          )
          : (<Text>{`${strings(`PRINT.${itemToEdit.paperSize}`)}`}</Text>
          )}
      </View>
      <View style={styles.printerContainer}>
        <View style={styles.printerAlignment}>
          <MaterialCommunityIcon name="printer-check" size={24} />
          <View style={styles.printerTextMargin}>
            {selectedPrinter?.name
              ? <Text>{selectedPrinter.name}</Text>
              : (
                <>
                  <Text>{strings('PRINT.FRONT_DESK')}</Text>
                  <Text style={styles.genericTextLabel}>{strings('GENERICS.DEFAULT')}</Text>
                </>
              )}
          </View>
        </View>
      </View>
      <Button
        title={strings('GENERICS.SAVE')}
        type={ButtonType.PRIMARY}
        style={styles.buttonWidth}
        onPress={handleSave}
        disabled={!isValidQty}
      />
    </>
  );
};

PrintQueueEdit.defaultProps = {
  queueName: 'PRICESIGN'
};
export default PrintQueueEdit;
