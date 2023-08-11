import React from 'react';
import { View } from 'react-native';
import Button, { ButtonType } from '../buttons/Button';
import styles from './AuditScreenFooter.style';
import { strings } from '../../locales';

interface AuditScreenFooterProps {
  onContinueClick: () => void;
  onSaveClick: () => void;
  disabledContinue: boolean;
  showSaveButton: boolean;
}

const AuditScreenFooter = ({
  onContinueClick,
  disabledContinue,
  onSaveClick,
  showSaveButton
}: AuditScreenFooterProps) => (
  <View style={styles.container}>
    <View style={styles.continueBtn}>
      <Button
        testID="btnSave"
        title={strings('GENERICS.SAVE')}
        type={ButtonType.SOLID_WHITE}
        onPress={onSaveClick}
      />
    </View>
    {showSaveButton ? (
      <View style={styles.continueBtn}>
        <Button
          testID="btnContinue"
          title={strings('GENERICS.CONTINUE')}
          type={ButtonType.PRIMARY}
          onPress={onContinueClick}
          disabled={disabledContinue}
        />
      </View>
    ) : null}
  </View>
);

export default AuditScreenFooter;
