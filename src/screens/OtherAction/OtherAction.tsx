import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { Dispatch } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import { AsyncState } from '../../models/AsyncState';
import ItemDetails from '../../models/ItemDetails';
import { Configurations } from '../../models/User';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import { styles } from './OtherAction.style';
import { strings } from '../../locales';

interface OtherActuonProps {
  exceptionType: string | null | undefined;
  getItemDetailsApi: AsyncState;
  countryCode: string;
  userConfigs: Configurations;
  navigation: NavigationProp<any>;
  trackEventCall: typeof trackEvent;
  dispatch: Dispatch<any>;
}
const OTHER_ACTIONS = 'other actions screen';

export const renderChooseActionRadioButtons = (
  item: any,
  dispatch: Dispatch<any>,
  trackEventCall: typeof trackEvent
): JSX.Element => {
  const onItemPress = () => {
    trackEventCall(OTHER_ACTIONS, {
      action: 'worklist_update_filter_exceptions'
      // exception: JSON.stringify(item.value)
    });
  };
  return (
    <TouchableOpacity
      testID="radio exception button"
      style={styles.completeActionCard}
      onPress={onItemPress}
    >
      <View style={styles.selectionView}>
        {item.selected ? (
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
      <View
        style={styles.completeActionRadioView}
      >
        <Text style={styles.completeActionTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.completeActionSubText}>{item.subText}</Text>
      </View>
    </TouchableOpacity>
  );
};
export const OtherActionScreen = (props: OtherActuonProps) => {
  const {
    exceptionType,
    getItemDetailsApi,
    countryCode,
    userConfigs,
    navigation,
    trackEventCall,
    dispatch
  } = props;

  const itemDetails: ItemDetails =
    getItemDetailsApi.result && getItemDetailsApi.result.data;
  // TEMP
  const wlCompleteButtons = [
    {
      title: strings('APPROVAL.OH_CHANGE'),
      subText: 'Make changes to the total on hands',
      isSelected: false
    },
    {
      title: strings('LOCATION.EDIT_LOCATION'),
      subText: 'Edit location of the item',
      isSelected: false
    },
    {
      title: strings('ITEM.CLEAN_RESERVE'),
      subText: 'Make changes to the reserve pallet qty',
      isSelected: false
    },
    {
      title: strings('ITEM.SCAN_FOR_NO_ACTION'),
      subText: 'The item is up to date no action is needed',
      isSelected: false
    }
  ];

  return (
    <View style={styles.safeAreaView}>
      <View>
        <ItemInfo
          itemName={itemDetails.itemName}
          itemNbr={itemDetails.itemNbr}
          upcNbr={itemDetails.upcNbr}
          status={itemDetails.status || ''}
          category={`${itemDetails.categoryNbr} - ${itemDetails.categoryDesc}`}
          exceptionType={exceptionType}
          additionalItemDetails={{
            color: itemDetails.color,
            margin: itemDetails.margin,
            vendorPackQty: itemDetails.vendorPackQty,
            grossProfit: itemDetails.grossProfit,
            size: itemDetails.size,
            basePrice: itemDetails.basePrice,
            source: {
              screen: OTHER_ACTIONS,
              action: 'additional_item_details_click'
            }
          }}
          countryCode={countryCode}
          showItemImage={userConfigs.showItemImage}
          worklistAuditType={itemDetails.worklistAuditType}
        />
      </View>
      <Text
        style={styles.desiredActionText}
        numberOfLines={2}
      >
        Complete the item by taking a desired action from below:
      </Text>
      <FlatList
        data={wlCompleteButtons}
        renderItem={({ item }) => renderChooseActionRadioButtons(item, dispatch, trackEventCall)}
        keyExtractor={item => item.title}
      />
    </View>
  );
};

const OtherAction = () => {
  const { exceptionType } = useTypedSelector(state => state.ItemDetailScreen);
  const { countryCode, configs } = useTypedSelector(state => state.User);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getItemDetailsApi = useTypedSelector(
    state => state.async.getItemDetailsV4
  );
  return (
    <OtherActionScreen
      exceptionType={exceptionType}
      countryCode={countryCode}
      userConfigs={configs}
      navigation={navigation}
      trackEventCall={trackEvent}
      dispatch={dispatch}
      getItemDetailsApi={getItemDetailsApi}
    />
  );
};

export default OtherAction;
