import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import ItemInfo from '../../components/iteminfo/ItemInfo';
import { AsyncState } from '../../models/AsyncState';
import ItemDetails from '../../models/ItemDetails';
import { Configurations } from '../../models/User';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import { styles } from './OtherAction.style';
import { strings } from '../../locales';
import Button, { ButtonType } from '../../components/buttons/Button';

export interface OtherActionProps {
  exceptionType: string | null | undefined;
  getItemDetailsApi: AsyncState;
  countryCode: string;
  userConfigs: Configurations;
  trackEventCall: typeof trackEvent;
  chosenActionState: [string, React.Dispatch<React.SetStateAction<string>>];
}
const OTHER_ACTIONS = 'other actions screen';

export const renderChooseActionRadioButtons = (
  item: { title: string; subText: string },
  trackEventCall: typeof trackEvent,
  chosenAction: string,
  setChosenAction: React.Dispatch<React.SetStateAction<string>>
): JSX.Element => {
  const onItemPress = () => {
    setChosenAction(item.title);
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
    countryCode,
    userConfigs,
    trackEventCall,
    chosenActionState
  } = props;

  const [chosenAction, setChosenAction] = chosenActionState;

  const itemDetails: ItemDetails = getItemDetailsApi.result && getItemDetailsApi.result.data;

  // TODO Filter based on exceptionType when adding screen functionality.
  const wlCompleteButtons = [
    {
      title: strings('GENERICS.ADD') + strings('ITEM.TO_PICKLIST'),
      subText: strings('ITEM.CHOOSE_PICKLIST')
    },
    {
      title: strings('ITEM.CLEAN_RESERVE'),
      subText: strings('ITEM.CHOOSE_RESERVE')
    },
    {
      title: strings('LOCATION.EDIT_LOCATION'),
      subText: strings('LOCATION.CHANGE_LOCATION')
    },
    {
      title: strings('APPROVAL.OH_CHANGE'),
      subText: strings('ITEM.CHOOSE_TOTAL_OH')
    },
    {
      title: strings('PRINT.PRICE_SIGN'),
      subText: strings('PRINT.CHOOSE_PRICE_SIGN')
    },
    {
      title: strings('ITEM.SCAN_FOR_NO_ACTION'),
      subText: strings('ITEM.NO_ACTION_NEEDED')
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
          exceptionType={exceptionType || undefined}
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
      <Text style={styles.desiredActionText} numberOfLines={2}>
        {strings('ITEM.DESIRED_ACTION')}
      </Text>
      <FlatList
        data={wlCompleteButtons}
        renderItem={({ item }) => renderChooseActionRadioButtons(
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
            onPress={() => undefined}
            width="50%"
            style={styles.continueButton}
          />
        </View>
      )}
    </View>
  );
};

const OtherAction = () => {
  const { exceptionType } = useTypedSelector(state => state.ItemDetailScreen);
  const { countryCode, configs } = useTypedSelector(state => state.User);
  const getItemDetailsApi = useTypedSelector(
    state => state.async.getItemDetailsV4
  );

  const chosenActionState = useState('');
  return (
    <OtherActionScreen
      exceptionType={exceptionType}
      countryCode={countryCode}
      userConfigs={configs}
      trackEventCall={trackEvent}
      getItemDetailsApi={getItemDetailsApi}
      chosenActionState={chosenActionState}
    />
  );
};

export default OtherAction;
