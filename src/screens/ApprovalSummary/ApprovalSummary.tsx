import React, { EffectCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import moment from 'moment';
import { QuantityChange } from '../../components/quantityChange/QuantityChange';
import { ButtonBottomTab } from '../../components/buttonTabCard/ButtonTabCard';
import { strings } from '../../locales';
import styles from './ApprovalSummary.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { ApprovalCategory, approvalAction } from '../../models/ApprovalListItem';
import { trackEvent } from '../../utils/AppCenterTool';
import { validateSession } from '../../utils/sessionTimeout';
import { resetApprovals } from '../../state/actions/Approvals';
import COLOR from '../../themes/Color';
import { updateApprovalList } from '../../state/actions/saga';
import { showSnackBar } from '../../state/actions/SnackBar';

interface ApprovalSummaryProps {
  route: RouteProp<any, string>;
  navigation: NavigationProp<any>;
  approvalList: ApprovalCategory[];
  approvalApi: {
    isWaiting: boolean;
    value: any;
    error: any;
    result: any;
  };
  apiStart: number;
  setApiStart: React.Dispatch<React.SetStateAction<number>>
  dispatch: Dispatch<any>
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  trackEventCall: (eventName: string, params?: any) => void;
  validateSessionCall: (navigation: any, route?: string) => Promise<void>;
}
interface ItemQuantity {
  oldQty: number;
  newQty: number;
  dollarChange: number;
  totalItems: number;
}
export const ApprovalSummaryScreen = (props: ApprovalSummaryProps): JSX.Element => {
  const {
    route, navigation, approvalList, approvalApi, dispatch, useEffectHook, apiStart, setApiStart,
    trackEventCall, validateSessionCall
  } = props;

  // Update Approval List Api
  useEffectHook(() => {
    if (!approvalApi.isWaiting && approvalApi.result) {
      trackEventCall('submit_approval_list_api_success', { duration: moment().valueOf() - apiStart });
      dispatch(resetApprovals());
      navigation.navigate({
        name: 'Approval',
        params: { prevRoute: route.name }
      });

      if (approvalApi.result.status === 200) {
        const successMessage = route.name === 'ApproveSummary'
          ? strings('APPROVAL.UPDATE_APPROVED') : strings('APPROVAL.UPDATE_REJECTED');
        dispatch(showSnackBar(successMessage, 3000));
        dispatch({ type: 'API/UPDATE_APPROVAL_LIST/RESET' });
      }
    }

    // on api failure
    if (!approvalApi.isWaiting && approvalApi.error) {
      trackEventCall('submit_approval_list_api_failure', {
        errorDetails: approvalApi.error.message || approvalApi.error,
        duration: moment().valueOf() - apiStart
      });
      // TODO handle unhappy path for Approve/Reject https://jira.walmart.com/browse/INTLSAOPS-2392 -2393
    }
  }, [approvalApi]);

  if (approvalApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={approvalApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }
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

  const checkedList: ApprovalCategory[] = [];
  const resolvedTime = moment().toISOString();

  approvalList.forEach(item => {
    if (item.isChecked && !item.categoryHeader) {
      checkedList.push({ ...item, resolvedTimestamp: resolvedTime });
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

  const handleApprovalSubmit = () => {
    validateSessionCall(navigation, route.name).then(() => {
      const actionType = route.name === 'ApproveSummary' ? approvalAction.Approve : approvalAction.Reject;
      trackEventCall('submit_approval_list_api_call', { approvalAction: actionType });
      setApiStart(moment().valueOf());
      dispatch(updateApprovalList({ approvalItems: checkedList, headers: { action: actionType } }));
    });
  };

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
            decreaseItems.totalItems === 1 ? strings('GENERICS.ITEM') : strings('GENERICS.ITEMS')})`}
        </Text>
        <QuantityChange
          oldQty={decreaseItems.oldQty}
          newQty={decreaseItems.newQty}
          dollarChange={decreaseItems.dollarChange}
        />
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.itemQtyText}>
          {`${strings('APPROVAL.INCREASES')} (${increaseItems.totalItems} ${
            increaseItems.totalItems === 1 ? strings('GENERICS.ITEM') : strings('GENERICS.ITEMS')})`}
        </Text>
        <QuantityChange
          oldQty={increaseItems.oldQty}
          newQty={increaseItems.newQty}
          dollarChange={increaseItems.dollarChange}
        />
      </View>
      <ButtonBottomTab
        leftTitle={strings('APPROVAL.GO_BACK')}
        onLeftPress={() => navigation.goBack()}
        rightTitle={strings('APPROVAL.CONFIRM')}
        onRightPress={() => handleApprovalSubmit()}
      />
    </View>
  );
};

export const ApprovalSummary = (): JSX.Element => {
  const { approvalList } = useTypedSelector(state => state.Approvals);
  const approvalApi = useTypedSelector(state => state.async.updateApprovalList);
  const [apiStart, setApiStart] = useState(0);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <ApprovalSummaryScreen
      route={route}
      navigation={navigation}
      approvalList={approvalList}
      approvalApi={approvalApi}
      apiStart={apiStart}
      setApiStart={setApiStart}
      dispatch={dispatch}
      useEffectHook={useEffect}
      trackEventCall={trackEvent}
      validateSessionCall={validateSession}
    />
  );
};
