import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomModalComponent } from './Modal';
import Button from '../../components/buttons/Button';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import styles from './ApiConfirmationModal.style';

interface ApiConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  api: AsyncState;
  mainText: string;
  subtext1?: string;
  subtext2?: string;
  errorText?: string;
  cancelText?: string;
  confirmText?: string;
  handleConfirm: () => void;
}

const ApiConfirmationModal = (props: ApiConfirmationModalProps): JSX.Element => {
  const {
    isVisible, onClose, api, mainText, subtext1, subtext2, errorText, handleConfirm, cancelText, confirmText
  } = props;

  const textView = () => !(errorText && api.error) && (
    <View style={styles.confirmationTextView}>
      <Text style={subtext1 ? styles.confirmationTextWithSubtext : styles.confirmationText}>
        {mainText}
      </Text>
      {subtext1 && (
      <Text style={styles.confirmationExtraText}>
        {subtext1}
      </Text>
      )}
      {subtext2 && (
      <Text style={styles.confirmationExtraText}>
        {subtext2}
      </Text>
      )}
    </View>
  );

  const errorView = () => errorText && api.error && (
    <View style={styles.confirmationTextView}>
      <MaterialCommunityIcon name="alert" size={30} color={COLOR.RED_500} style={styles.iconPosition} />
      <Text style={styles.confirmationText}>
        {errorText}
      </Text>
    </View>
  );

  return (
    <CustomModalComponent
      isVisible={isVisible}
      onClose={() => onClose()}
      modalType="Error"
    >
      {textView()}
      {errorView()}
      <View style={styles.buttonContainer}>
        <Button
          style={styles.delButton}
          title={cancelText ?? strings('GENERICS.CANCEL')}
          backgroundColor={COLOR.MAIN_THEME_COLOR}
          onPress={() => onClose()}
        />
        <Button
          style={styles.delButton}
          title={api.error ? strings('GENERICS.RETRY') : (confirmText ?? strings('GENERICS.OK'))}
          backgroundColor={COLOR.TRACKER_RED}
          onPress={handleConfirm}
        />
      </View>
    </CustomModalComponent>
  );
};

ApiConfirmationModal.defaultProps = {
  subtext1: null,
  subtext2: null,
  errorText: null,
  cancelText: null,
  confirmText: null
};

export default ApiConfirmationModal;
