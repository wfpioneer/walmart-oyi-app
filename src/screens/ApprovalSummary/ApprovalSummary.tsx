import React from 'react';
import { Text, View } from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { renderQuantityChange } from '../../components/approvalCard/ApprovalCard';
import { ButtonBottomTab } from '../../components/buttonTabCard/ButtonTabCard';
import { strings } from '../../locales';
import styles from './ApprovalSummary.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { ApprovalCategory } from '../ApprovalList/ApprovalList';

interface ApprovalSummaryProps {
  route: RouteProp<any, string>;
  navigation: NavigationProp<any>;
  approvalList: ApprovalCategory[];
}
interface ItemQuantity {
  oldQty: number;
  newQty: number;
  dollarChange: number;
  totalItems: number;
}
export const ApprovalSummaryScreen = (props: ApprovalSummaryProps): JSX.Element => {
  const { route, navigation, approvalList } = props;

  const decreaseItems: ItemQuantity = {
    oldQty: 0,
    newQty: 0,
    dollarChange: 0,
    totalItems: 0
  };
  const increaseItems: ItemQuantity = {
    oldQty: 0,
    newQty: 0,
    dollarChange: 0,
    totalItems: 0
  };

  approvalList.forEach(item => {
    if (item.isChecked && !item.categoryHeader) {
      if (item.newQuantity > item.oldQuantity) {
        increaseItems.oldQty += item.oldQuantity;
        increaseItems.newQty += item.newQuantity;
        increaseItems.dollarChange += item.dollarChange;
        increaseItems.totalItems += 1;
      } else {
        decreaseItems.oldQty += item.oldQuantity;
        decreaseItems.newQty += item.newQuantity;
        decreaseItems.dollarChange += item.dollarChange;
        decreaseItems.totalItems += 1;
      }
    }
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {route.name === 'ApproveSummary'
            ? strings('APPROVAL.APPROVE_SUMMARY') : strings('APPROVAL.REJECT_SUMMARY')}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.itemQtyText}>
          {`${strings('APPROVAL.DECREASES')} (${decreaseItems.totalItems} ${
            decreaseItems.totalItems === 1 ? strings('WORKLIST.ITEM') : strings('WORKLIST.ITEMS')})`}
        </Text>
        {renderQuantityChange(decreaseItems.oldQty, decreaseItems.newQty, decreaseItems.dollarChange)}
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.itemQtyText}>
          {`${strings('APPROVAL.INCREASES')} (${increaseItems.totalItems} ${
            increaseItems.totalItems === 1 ? strings('WORKLIST.ITEM') : strings('WORKLIST.ITEMS')})`}
        </Text>
        {renderQuantityChange(increaseItems.oldQty, increaseItems.newQty, increaseItems.dollarChange)}
      </View>
      <ButtonBottomTab
        leftTitle={strings('APPROVAL.GO_BACK')}
        onLeftPress={() => navigation.goBack()}
        rightTitle={strings('APPROVAL.CONFIRM')}
        // TODO implement dispatch call to Approve/Reject items https://jira.walmart.com/browse/INTLSAOPS-2390 -2393
        onRightPress={() => undefined}
      />
    </View>
  );
};

export const ApprovalSummary = (): JSX.Element => {
  const { approvalList } = useTypedSelector(state => state.Approvals);
  const route = useRoute();
  const navigation = useNavigation();
  return (
    <ApprovalSummaryScreen
      route={route}
      navigation={navigation}
      approvalList={approvalList}
    />
  );
};
