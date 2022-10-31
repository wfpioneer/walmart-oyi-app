import React from 'react';
import {
  ActivityIndicator, Platform, Text, TouchableOpacity, View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import { COLOR } from '../../themes/Color';
import styles from './LocationListCard.style';
import LocationCard from '../LocationCard/LocationCard';

export type LocationType = 'floor' | 'reserve'

export interface LocationList {
    sectionId: number;
    locationName: string;
    quantity: number;
    palletId: number;
    increment: () => void;
    decrement: () => void;
    onDelete: () => void;
    openCalc: () => void;
    scanned?: boolean;
}

interface LocationListCardProp {
  locationList: LocationList[];
  // eslint-disable-next-line react/require-default-props
  add?: () => void;
  locationType: LocationType;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  scanRequired: boolean;
}

const renderLocationCard = ({
  item, locationType, scanRequired, index
}:
  { item: LocationList, locationType: LocationType, scanRequired: boolean, index: number }) => {
  const {
    locationName, quantity, palletId, increment, decrement, onDelete, openCalc, scanned
  } = item;
  return (
    <View style={styles.locationCard} key={`${locationName}-${index}`}>
      <LocationCard
        location={locationName}
        locationType={locationType}
        onQtyIncrement={increment}
        onInputClick={openCalc}
        onQtyDecrement={decrement}
        palletId={palletId}
        scannerEnabled={scanRequired}
        quantity={quantity}
        onLocationDelete={onDelete}
        scanned={scanned}
      />
    </View>
  );
};

const LocationListCard = (props: LocationListCardProp) : JSX.Element => {
  const {
    locationList,
    add,
    locationType,
    loading,
    error,
    onRetry,
    scanRequired
  } = props;
  const locationTitle = locationType === 'floor' ? strings('LOCATION.FLOOR') : strings('LOCATION.RESERVE');

  if (error) {
    return (
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <View>
              <MaterialCommunityIcon name="map-marker-outline" size={25} color={COLOR.BLACK} />
            </View>
            <View>
              <Text style={styles.title}>
                {`${locationTitle}`}
              </Text>
              <Text style={styles.subText}>
                {locationType === 'reserve' ? strings('AUDITS.VALIDATE_SCAN_QUANTITY')
                  : strings('AUDITS.VALIDATE_QUANTITY')}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.errorView}>
          <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
          <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={onRetry}
            testID="retry-button"
          >
            <Text>{strings('GENERICS.RETRY')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <View>
            <MaterialCommunityIcon name="map-marker-outline" size={25} color={COLOR.BLACK} />
          </View>
          <View>
            <Text style={styles.title}>
              {`${locationTitle} ${!loading ? `(${locationList.length})` : ''}`}
            </Text>
            <Text style={styles.subText}>
              {locationType === 'reserve' ? strings('AUDITS.VALIDATE_SCAN_QUANTITY')
                : strings('AUDITS.VALIDATE_QUANTITY')}
            </Text>
          </View>
        </View>
        {locationType === 'floor' && !loading
            && (
            <TouchableOpacity
              hitSlop={{
                top: 10, bottom: 10, left: 15, right: 15
              }}
              onPress={add}
              testID="add-location"
            >
              <MaterialCommunityIcon name="plus-thick" size={25} color={COLOR.MAIN_THEME_COLOR} />
            </TouchableOpacity>
            )}
      </View>
      {loading ? (
        <View style={styles.loader} testID="loader">
          <ActivityIndicator size={30} color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
        </View>
      ) : (
        <>
          {
            locationList.length ? locationList.map((item, index) => renderLocationCard({
              item, locationType, scanRequired, index
            }))
              : (
                <View style={styles.nolocation}>
                  <Text>
                    { locationType === 'floor' ? strings('AUDITS.NO_LOCATION_AVAILABLE')
                      : strings('AUDITS.NO_PALLETS_FOUND_FOR_ITEM')}
                  </Text>
                </View>
              )
          }
        </>
      )}
    </View>
  );
};

export default LocationListCard;
