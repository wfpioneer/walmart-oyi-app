import React from 'react';
import { Text, View } from 'react-native';
import { Dispatch } from 'redux';
import { NavigationProp } from '@react-navigation/native';
import { CustomModalComponent } from '../../screens/Modal/Modal';
import { strings } from '../../locales';
import { UseStateType } from '../../models/Generics.d';
import Button, { ButtonType } from '../buttons/Button';
import COLOR from '../../themes/Color';
import styles from './UnsavedWarningModal.style';

export const renderUnsavedWarningModal = (
  displayWarningModal: boolean,
  setDisplayWarningModal: UseStateType<boolean>[1],
  title: string,
  message: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onConfirm: () => void
) => (
  <CustomModalComponent
    isVisible={displayWarningModal}
    onClose={() => setDisplayWarningModal(false)}
    modalType="Popup"
  >
    <>
      <View>
        <Text style={styles.labelHeader}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.buttonAlign}
          title={strings('GENERICS.CANCEL')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          type={ButtonType.SOLID_WHITE}
          onPress={() => setDisplayWarningModal(false)}
          testID="cancelBack"
        />
        <Button
          style={styles.buttonAlign}
          title={strings('GENERICS.OK')}
          type={ButtonType.PRIMARY}
          onPress={() => onConfirm()}
          testID="confirmBack"
        />
      </View>
    </>
  </CustomModalComponent>
);
