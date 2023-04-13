import React, { Dispatch, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import {
  NavigationProp, RouteProp, useNavigation, useRoute
} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import { AsyncState } from '../../models/AsyncState';
import ItemDetails from '../../models/ItemDetails';
import User from '../../models/User';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import { styles } from './OtherAction.style';
import { strings } from '../../locales';
import Button, { ButtonType } from '../../components/buttons/Button';
import { UseStateType } from '../../models/Generics.d';
import { validateSession } from '../../utils/sessionTimeout';
import { setAuditItemNumber } from '../../state/actions/AuditWorklist';
import { setItemDetails } from '../../state/actions/ReserveAdjustmentScreen';

export interface OtherActionProps {
  exceptionType: string | null | undefined;
  getItemDetailsApi: AsyncState;
  trackEventCall: typeof trackEvent;
  chosenActionState: UseStateType<string>;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  route: RouteProp<any, string>;
  validateSessionCall: typeof validateSession;
  appUser: User;
}

type DesiredActionButton = {
  title: string;
  subText: string;
}

export const OTHER_ACTIONS = 'other actions screen';
const EDIT_LOCATION = strings('LOCATION.EDIT_LOCATION');
const CHANGE_LOCATION = strings('LOCATION.CHANGE_LOCATION');
const OH_CHANGE = strings('APPROVAL.OH_CHANGE');
const TOTAL_OH = strings('ITEM.CHOOSE_TOTAL_OH');
const CLEAN_RESERVE = strings('ITEM.CLEAN_RESERVE');
const CHOOSE_RESERVE = strings('ITEM.CHOOSE_RESERVE');
const ADD_PICKLIST = strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST');
const CHOOSE_PICKLIST = strings('ITEM.CHOOSE_PICKLIST');
const SCAN_NO_ACTION = strings('ITEM.SCAN_FOR_NO_ACTION');
const NO_ACTION_NEEDED = strings('ITEM.NO_ACTION_NEEDED');
const PRICE_SIGN = strings('PRINT.PRICE_SIGN');

export const renderChooseActionRadioButtons = (
  item: { title: string; subText: string },
  trackEventCall: typeof trackEvent,
  chosenAction: string,
  setChosenAction: React.Dispatch<React.SetStateAction<string>>
): JSX.Element => {
  const onItemPress = () => {
    setChosenAction(item.title);
    trackEventCall(OTHER_ACTIONS, {
      action: 'worklist_update_filter_exceptions',
      exception: item.title
    });
  };
  return (
    <TouchableOpacity
      testID="radio action button"
      style={styles.completeActionCard}
      onPress={onItemPress}
    >
      <View style={styles.selectionView}>
        {item.title === chosenAction ? (
          <MaterialCommunityIcons
            name="radiobox-marked"
            size={15}
            color={COLOR.MAIN_THEME_COLOR}
          />
        ) : (
          <MaterialCommunityIcons
            name="radiobox-blank"
            size={15}
            color={COLOR.MAIN_THEME_COLOR}
          />
        )}
      </View>
      <View style={styles.completeActionRadioView}>
        <Text style={styles.completeActionTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.completeActionSubText}>{item.subText}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const OtherActionScreen = (props: OtherActionProps) => {
  const {
    exceptionType,
    getItemDetailsApi,
    trackEventCall,
    chosenActionState,
    dispatch,
    navigation,
    route,
    validateSessionCall,
    appUser
  } = props;

  const {
    countryCode, configs: userConfigs, features, userId
  } = appUser;
  const [chosenAction, setChosenAction] = chosenActionState;

  const itemDetails: ItemDetails = getItemDetailsApi.result && getItemDetailsApi.result.data;

  const desiredActionButtonsMap: Map<string | null | undefined, DesiredActionButton[]> = new Map();

  desiredActionButtonsMap.set('C', [
    { title: EDIT_LOCATION, subText: CHANGE_LOCATION },
    { title: OH_CHANGE, subText: TOTAL_OH },
    { title: CLEAN_RESERVE, subText: CHOOSE_RESERVE },
    { title: SCAN_NO_ACTION, subText: NO_ACTION_NEEDED }
  ]);
  desiredActionButtonsMap.set('NS', [
    { title: ADD_PICKLIST, subText: CHOOSE_PICKLIST },
    { title: OH_CHANGE, subText: TOTAL_OH },
    { title: PRICE_SIGN, subText: strings('PRINT.CHOOSE_PRICE_SIGN') },
    { title: SCAN_NO_ACTION, subText: NO_ACTION_NEEDED }
  ]);
  desiredActionButtonsMap.set('NP', [
    { title: ADD_PICKLIST, subText: CHOOSE_PICKLIST },
    { title: CLEAN_RESERVE, subText: CHOOSE_RESERVE },
    { title: EDIT_LOCATION, subText: CHANGE_LOCATION },
    { title: OH_CHANGE, subText: TOTAL_OH },
    { title: SCAN_NO_ACTION, subText: NO_ACTION_NEEDED }
  ]);

  const desiredActions = desiredActionButtonsMap.get(exceptionType);

  if (!features.includes('on hands change')) {
    desiredActions?.filter(item => item.title !== OH_CHANGE);
  }

  const continueAction = () => {
    switch (chosenAction) {
      case SCAN_NO_ACTION: {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall(
            OTHER_ACTIONS,
            { action: 'scan_for_no_action_click', itemNbr: itemDetails.itemNbr }
          );
          navigation.navigate('NoActionScan');
        }).catch(() => {
          trackEventCall('session_timeout', { user: userId });
        });
        break;
      }
      case EDIT_LOCATION: {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall(OTHER_ACTIONS, { action: 'location_details_click', itemNbr: itemDetails.itemNbr });
          navigation.navigate('LocationDetails');
        }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
        break;
      }
      case OH_CHANGE: {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall(OTHER_ACTIONS, { action: 'update_OH_qty_click', itemNbr: itemDetails.itemNbr });
          if (userConfigs.auditWorklists) {
            dispatch(setAuditItemNumber(itemDetails.itemNbr));
            navigation.navigate('AuditItem');
          }
        }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
        break;
      }
      case CLEAN_RESERVE: {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall(OTHER_ACTIONS, { action: 'reserve_adjustment_click', itemNbr: itemDetails.itemNbr });
          dispatch(setItemDetails(itemDetails));
          navigation.navigate('ReserveAdjustment');
        }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
        break;
      }
      case ADD_PICKLIST: {
        // TODO ADD CREATE PICK DIALOG FLOW
        break;
      }
      case PRICE_SIGN: {
        validateSessionCall(navigation, route.name).then(() => {
          trackEventCall(OTHER_ACTIONS, { action: 'print_sign_button_click', itemNbr: itemDetails.itemNbr });
          navigation.navigate('PrintPriceSign', { screen: 'PrintPriceSignScreen' });
        }).catch(() => { trackEventCall('session_timeout', { user: userId }); });
        break;
      }
      default:
    }
  };

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.itemContainer}>
        <ItemInfo
          itemName={itemDetails.itemName}
          itemNbr={itemDetails.itemNbr}
          upcNbr={itemDetails.upcNbr}
          status={itemDetails.status || ''}
          category={`${itemDetails.categoryNbr} - ${itemDetails.categoryDesc}`}
          exceptionType={exceptionType || undefined}
          countryCode={countryCode}
          showItemImage={userConfigs.showItemImage}
          worklistAuditType={itemDetails.worklistAuditType}
        />
      </View>
      <Text style={styles.desiredActionText} numberOfLines={2}>
        {strings('ITEM.DESIRED_ACTION')}
      </Text>
      <FlatList
        data={desiredActions}
        renderItem={({ item }: {item: DesiredActionButton}) => renderChooseActionRadioButtons(
          item,
          trackEventCall,
          chosenAction,
          setChosenAction
        )}
        keyExtractor={item => item.title}
      />
      {chosenAction !== '' && (
        <View style={styles.buttonContainer}>
          <Button
            title={strings('GENERICS.CONTINUE')}
            titleColor={COLOR.WHITE}
            type={ButtonType.PRIMARY}
            onPress={continueAction}
            width="50%"
            style={styles.continueButton}
            testID="chosen action button"
          />
        </View>
      )}
    </View>
  );
};

const OtherAction = () => {
  const { exceptionType } = useTypedSelector(state => state.ItemDetailScreen);
  const user = useTypedSelector(state => state.User);
  const getItemDetailsApi = useTypedSelector(
    state => state.async.getItemDetailsV4
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const chosenActionState = useState('');
  return (
    <OtherActionScreen
      exceptionType={exceptionType}
      trackEventCall={trackEvent}
      getItemDetailsApi={getItemDetailsApi}
      chosenActionState={chosenActionState}
      dispatch={dispatch}
      navigation={navigation}
      appUser={user}
      route={route}
      validateSessionCall={validateSession}
    />
  );
};

export default OtherAction;
