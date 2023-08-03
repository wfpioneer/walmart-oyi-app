import React from 'react';
import { View } from 'react-native';
import Button, { ButtonType } from '../buttons/Button';
import styles from './AuditScreenFooter.style';
import { strings } from '../../locales';

interface AuditScreenFooterProps {
  onContinueClick: () => void;
  disabledContinue: boolean;
}

const AuditScreenFooter = ({ onContinueClick, disabledContinue }: AuditScreenFooterProps) => (
  <View style={styles.container}>
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
