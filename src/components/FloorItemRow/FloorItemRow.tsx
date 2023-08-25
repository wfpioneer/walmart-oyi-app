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
  setIsToolBarNavigation,
  setSelectedItem,
  showItemPopup
} from '../../state/actions/Location';
import styles from './FloorItemRow.style';
import { currencies, strings } from '../../locales';
import { SectionDetailsItem } from '../../models/LocationItems';
import { setScannedEvent } from '../../state/actions/Global';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

export type FloorItemRowProps = {
  item: SectionDetailsItem;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  trackEventCall: (eventName: string, params?: any) => void;
  imageToken?: string | undefined;
  tokenIsWaiting?: boolean;
};

const FloorItemRow = (props: FloorItemRowProps): JSX.Element => {
  const {
    item, dispatch, navigation, trackEventCall,
    imageToken, tokenIsWaiting
  } = props;
  const user = useTypedSelector(state => state.User);
  const location = useTypedSelector(state => state.Location);
  const itemOnPress = () => {
    trackEventCall('Section_Details', {
      action: 'navigating_to_review_item_details_screen',
      itemNbr: item.itemNbr
    });
    dispatch(
      setScannedEvent({ type: 'Section', value: item.itemNbr.toString() })
    );
    navigation.navigate('ReviewItemDetails', { screen: 'ReviewItemDetailsHome' });
    dispatch(setIsToolBarNavigation(false));
  };

  const locationManagementEdit = () => user.features.includes('location management edit')
    || user.configs.locationManagementEdit;

  return (
    <TouchableOpacity
      disabled={location.itemPopupVisible || location.locationPopupVisible}
      onPress={() => itemOnPress()}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {user.configs.showItemImage
          && (
          <ImageWrapper
            itemNumber={item.itemNbr}
            countryCode={user.countryCode}
            imageStyle={styles.itemImage}
            imageToken={imageToken}
            tokenIsWaiting={tokenIsWaiting}
          />
          )}
        </View>
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

FloorItemRow.defaultProps = {
  imageToken: undefined,
  tokenIsWaiting: false
};
