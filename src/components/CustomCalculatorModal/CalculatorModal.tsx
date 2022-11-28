import React from 'react';
import { View } from 'react-native';
import styles from './CalculatorModal.style';
import Button from '../buttons/Button';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { CustomModalComponent } from '../../screens/Modal/Modal';

import Calculator from '../Calculator/Calculator';

export interface CalculatorModalProps {
    visible: boolean;
    onClose(): void;
    onAccept(value: string): void;
    showAcceptButton: boolean;
    disableAcceptButton(value: string): boolean;
}

const CalculatorModal = (props: CalculatorModalProps) => {
  const {
    onClose, onAccept, showAcceptButton, disableAcceptButton, visible
  } = props;
  const [calcValue, setCalcValue] = React.useState('');
  return (
    <CustomModalComponent
      isVisible={visible}
      modalType="Form"
      onClose={onClose}
    >
      <View style={styles.containerPadding} />
      <Calculator
        onEquals={((value: number) => setCalcValue(value.toString()))}
        onClear={() => setCalcValue('')}
        showNegValidation={true}
      />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title={strings('GENERICS.CLOSE')}
          backgroundColor={COLOR.MAIN_THEME_COLOR}
          onPress={() => {
            setCalcValue('');
            onClose();
          }}
          testID="modal-close-button"
        />
        {showAcceptButton && (
        <Button
          style={styles.button}
          title={strings('PICKING.ACCEPT')}
          disabled={disableAcceptButton(calcValue)}
          backgroundColor={COLOR.MAIN_THEME_COLOR}
          onPress={() => { onAccept(calcValue); setCalcValue(''); }}
          testID="modal-accept-button"
        />
        )}
      </View>
    </CustomModalComponent>
  );
};

export default CalculatorModal;
