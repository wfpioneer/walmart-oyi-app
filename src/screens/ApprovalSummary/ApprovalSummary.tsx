import React from 'react';
import { Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { renderQuantityChange } from '../../components/approvalCard/ApprovalCard';
import { ButtonBottomTab } from '../../components/buttonTabCard/ButtonTabCard';
import { strings } from '../../locales/index';
import styles from './ApprovalSummary.style';

interface ApprovalSummaryProps {
  route: RouteProp<any, string>;
}

export const ApprovalSummary = () => {
  const route = useRoute();
  return (
    <ApprovalSummaryScreen
      route={route}
    />
  );
};

export const ApprovalSummaryScreen = (props: ApprovalSummaryProps) => {
  const { route } = props;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {route.name === 'ApproveSummary'
            ? strings('APPROVAL.APPROVE_SUMMARY') : strings('APPROVAL.REJECT_SUMMARY')}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.itemQtyText}>{`${strings('APPROVAL.DECREASES')} (30 items)`}</Text>
        {renderQuantityChange(120, 100, 350)}
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.itemQtyText}>{`${strings('APPROVAL.INCREASES')} (0 items)`}</Text>
        {renderQuantityChange()}
      </View>
      <ButtonBottomTab
        leftTitle={strings('APPROVAL.GO_BACK')}
        onLeftPress={() => undefined}
        rightTitle={strings('APPROVAL.CONFIRM')}
        onRightPress={() => undefined}
      />
    </View>
  );
};
