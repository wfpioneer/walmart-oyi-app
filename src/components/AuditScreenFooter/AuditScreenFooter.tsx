import React from 'react';
import { View } from 'react-native';
import Button, { ButtonType } from '../buttons/Button';
import styles from './AuditScreenFooter.style';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';

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
    {showSaveButton ? (
      <View style={styles.continueBtn}>
        <Button
          testID="btnSave"
          title={strings('GENERICS.SAVE')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          type={ButtonType.SOLID_WHITE}
          onPress={onSaveClick}
        />
      </View>
    ) : null}
    <View style={styles.continueBtn}>
      <Button
        testID="btnContinue"
        title={strings('GENERICS.CONTINUE')}
        type={ButtonType.PRIMARY}
        onPress={onContinueClick}
        disabled={disabledContinue}
      />
    </View>
  </View>
);

export default AuditScreenFooter;
