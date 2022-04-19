import React, { Dispatch } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {
  clearSelectedItem,
  hideItemPopup,
  setSelectedItem,
  showItemPopup
} from '../../state/actions/Location';
import styles from './FloorItemRow.style';
import { currencies, strings } from '../../locales';
import { SectionDetailsItem } from '../../models/LocationItems';
import { setScannedEvent } from '../../state/actions/Global';

export type FloorItemRowProps = {
  item: SectionDetailsItem;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
};

const FloorItemRow = (props: FloorItemRowProps): JSX.Element => {
  const { item, dispatch, navigation } = props;
  const user = useTypedSelector(state => state.User);
  const location = useTypedSelector(state => state.Location);
  const itemOnPress = () => {
    dispatch(
      setScannedEvent({ type: 'Section', value: item.itemNbr.toString() })
    );
    navigation.navigate('ReviewItemDetails');
  };

  const locationManagementEdit = () => user.features.includes('location management edit')
    || user.configs.locationManagementEdit;

  return (
    <TouchableOpacity
      disabled={location.itemPopupVisible || location.locationPopupVisible}
      onPress={() => itemOnPress()}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.pallet}>
            <Text style={styles.itemNbr}>
              {`${strings('ITEM.ITEM')} ${item.itemNbr}`}
            </Text>
            {locationManagementEdit() && (
              <TouchableOpacity
                onPress={() => {
                  if (location.itemPopupVisible) {
                    dispatch(clearSelectedItem());
                    dispatch(hideItemPopup());
                  } else {
                    dispatch(setSelectedItem(item));
                    dispatch(showItemPopup());
                  }
                }}
                disabled={location.locationPopupVisible}
              >
                <View style={styles.rightButton}>
                  <Image
                    style={styles.image}
                    source={require('../../assets/images/menu1.png')}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.itemDesc}>{item.itemDesc}</Text>
          <Text style={styles.price}>{currencies(item.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FloorItemRow;
