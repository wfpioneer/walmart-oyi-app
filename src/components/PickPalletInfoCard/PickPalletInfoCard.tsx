import React, { Dispatch } from 'react';
import {
  FlatList, Pressable, Text, View
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { strings } from '../../locales';
import { PickAction, PickListItem, PickStatus } from '../../models/Picking.d';
import { updatePicklistStatus } from '../../state/actions/saga';
import { updateMultiPickSelection } from '../../state/actions/Picking';
import PickItemInfo from '../PickItemInfoCard/PickItemInfoCard';
import styles from './PickPalletInfoCard.style';
import COLOR from '../../themes/Color';

interface PickPalletInfoProps {
  palletId: string;
  pickListItems: PickListItem[];
  onPress: () => void;
  pickStatus: PickStatus;
  palletLocation: string;
  dispatch: Dispatch<any>
  canDelete: boolean;
  isSelected?: boolean;
  showCheckbox: boolean;
}

const toggleMultiPickSelection = (
  isSelected: boolean,
  dispatch: Dispatch<any>,
  items: PickListItem[]
) => {
  dispatch(updateMultiPickSelection(items, !isSelected));
};

const PickPalletInfoCard = (props: PickPalletInfoProps) => {
  const {
    onPress, palletId, pickListItems, pickStatus, palletLocation, dispatch, canDelete, isSelected, showCheckbox
  } = props;

  const palletsItems = pickListItems.filter(item => item.palletId === palletId);

  const renderItem = ({ item }: { item: PickListItem }) => (
    <PickItemInfo
      pickListItem={item}
      canDelete={canDelete && pickStatus === PickStatus.READY_TO_PICK}
      onDeletePressed={() => dispatch(updatePicklistStatus({
        headers: { action: PickAction.DELETE },
        picklistItems: [{
          picklistId: item.id,
          locationId: item.palletLocationId,
          locationName: item.palletLocationName
        }],
        palletId: item.palletId
      }))}
    />
  );

  const pickStatusString = () => pickStatus.toUpperCase().replace(/\s/g, '_');

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} testID="palletPress">
        <View style={showCheckbox ? styles.header : { ...styles.header, padding: 10 }}>
          <View style={styles.palletInfoSel}>
            {showCheckbox && (
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => toggleMultiPickSelection(!!isSelected, dispatch, pickListItems)}
              color={COLOR.MAIN_THEME_COLOR}
              uncheckedColor={COLOR.MAIN_THEME_COLOR}
            />
            )}
            <Text>{`${strings('PALLET.PALLET_ID')} ${palletId}`}</Text>
          </View>
          <Text>{strings(`PICKING.${pickStatusString()}`)}</Text>
          <Text style={showCheckbox ? styles.textRightPadding : {}}>{palletLocation}</Text>
        </View>
        <FlatList
          data={palletsItems}
          renderItem={renderItem}
          scrollEnabled={false}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
      </Pressable>
    </View>
  );
};

export default PickPalletInfoCard;

PickPalletInfoCard.defaultProps = {
  isSelected: false
};
