import React, { EffectCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import moment from 'moment';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuantityChange } from '../../components/quantityChange/QuantityChange';
import { ButtonBottomTab } from '../../components/buttonTabCard/ButtonTabCard';
import { strings } from '../../locales';
import styles from './ApprovalSummary.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { ApprovalCategory, approvalAction } from '../../models/ApprovalListItem';
import { validateSession } from '../../utils/sessionTimeout';
import { resetApprovals } from '../../state/actions/Approvals';
import COLOR from '../../themes/Color';
import { updateApprovalList } from '../../state/actions/saga';
import { showSnackBar } from '../../state/actions/SnackBar';
import Button from '../../components/buttons/Button';
import { AsyncState } from '../../models/AsyncState';
import { UPDATE_APPROVAL_LIST } from '../../state/actions/asyncAPI';
import { CustomModal } from '../Modal/Modal';

interface ApprovalSummaryProps {
  route: RouteProp<any, string>;
  navigation: NavigationProp<any>;
  approvalList: ApprovalCategory[];
  approvalApi: AsyncState;
  errorModalVisible: boolean;
  setErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  dispatch: Dispatch<any>
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
  validateSessionCall: (navigation: any, route?: string) => Promise<void>;
}
interface ItemQuantity {
  oldQty: number;
  newQty: number;
  dollarChange: number;
  totalItems: number;
}

export const renderErrorModal = (setErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>): JSX.Element => (
  // Used to overlay the modal in the screen view
  <CustomModal isVisible={true} onClose={() => setErrorModalVisible(false)} modalType="Error">
    <MaterialCommunityIcon name="alert" size={30} color={COLOR.RED_500} style={styles.iconPosition} />
    <Text style={styles.errorText}>
      {strings('APPROVAL.UPDATE_API_ERROR')}
    </Text>
    <View style={styles.buttonContainer}>
      <Button
        style={styles.dismissButton}
        title={strings('GENERICS.OK')}
        backgroundColor={COLOR.TRACKER_RED}
        onPress={() => setErrorModalVisible(false)}
      />
    </View>
  </CustomModal>
);

export const ApprovalSummaryScreen = (props: ApprovalSummaryProps): JSX.Element => {
  const {
    route, navigation, approvalList, approvalApi, dispatch, useEffectHook,
    validateSessionCall, errorModalVisible, setErrorModalVisible
  } = props;
  const checkedList: ApprovalCategory[] = [];
  const resolvedTime = moment().toISOString();
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

  // Update Approval List Api
  useEffectHook(() => {
    if (!approvalApi.isWaiting && approvalApi.result) {
      dispatch(resetApprovals());
      navigation.navigate({
        name: 'Approval',
        params: { prevRoute: route.name }
      });

      if (approvalApi.result.status === 200) {
        const successMessage = route.name === 'ApproveSummary'
          ? strings('APPROVAL.UPDATE_APPROVED') : strings('APPROVAL.UPDATE_REJECTED');
        dispatch(showSnackBar(successMessage, 3000));
        // Reset update approval api state to prevent navigator from looping back to the approvalist screen
        dispatch({ type: UPDATE_APPROVAL_LIST.RESET });
      }
    }

    // on api failure
    if (!approvalApi.isWaiting && approvalApi.error) {
      setErrorModalVisible(true);
      dispatch({ type: UPDATE_APPROVAL_LIST.RESET });
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
      dispatch(updateApprovalList({ approvalItems: checkedList, headers: { action: actionType } }));
    });
  };

  return (
    <View style={styles.mainContainer}>
      { errorModalVisible && renderErrorModal(setErrorModalVisible)}
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
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <ApprovalSummaryScreen
      route={route}
      navigation={navigation}
      approvalList={approvalList}
      approvalApi={approvalApi}
      dispatch={dispatch}
      useEffectHook={useEffect}
      validateSessionCall={validateSession}
      errorModalVisible={errorModalVisible}
      setErrorModalVisible={setErrorModalVisible}
    />
  );
};
