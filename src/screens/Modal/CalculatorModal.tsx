import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { CustomModalComponent } from './Modal';
import Button from '../../components/buttons/Button';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './CalculatorModal.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { setCalcOpen } from '../../state/actions/Global';

const CalculatorModal = (): JSX.Element => {
  const dispatch = useDispatch();
  const { calcOpen } = useTypedSelector(state => state.Global);
  const onClose = () => {
    dispatch(setCalcOpen(false));
  };

  return (
    <CustomModalComponent
      isVisible={calcOpen}
      onClose={onClose}
      modalType="Form"
    >
      {/* TODO Calculator Comp */}
      <View />
      <View style={styles.buttonContainer}>
        <Button
          style={styles.closeBtn}
          title={strings('GENERICS.CLOSE')}
          backgroundColor={COLOR.MAIN_THEME_COLOR}
          onPress={onClose}
        />
      </View>
    </CustomModalComponent>
  );
};

export default CalculatorModal;
