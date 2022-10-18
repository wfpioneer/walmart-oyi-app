import React from 'react';
import { Text, View } from 'react-native';
import Button, { ButtonType } from '../buttons/Button';
import styles from './AuditScreenFooter.style';
import { strings } from '../../locales';

interface AuditScreenFooterProps {
  totalCount: number;
  onContinueClick: () => void;
  disabledContinue: boolean;
}

const AuditScreenFooter = ({ totalCount, onContinueClick, disabledContinue }: AuditScreenFooterProps) => (
  <View style={styles.container}>
    <View style={styles.totalCntVw}>
      <Text style={styles.totalCnt}>
        {`${totalCount} ${strings('GENERICS.ITEMS')}`}
      </Text>
    </View>
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
