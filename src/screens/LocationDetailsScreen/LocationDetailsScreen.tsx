import React from 'react';
import {
  View
} from 'react-native';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import { LocationHeader } from '../../components/locationHeader/LocationHeader';
import { mockLocationDetails } from '../../mockData/locationDetails';
import { LocationItem } from '../../models/LocationItems';
import LocationTabs from '../../components/LocationTabs/LocationTabs';

interface LocationDetailProps {
  sectionName: string,
  mockData: LocationItem
}

export const LocationDetailsScreen = (props: LocationDetailProps) : JSX.Element => {
  const {
    sectionName,
    mockData
  } = props;

  const floor = mockData.floor.length;
  const reserve = mockData.reserve.length;

  return (
    <View>
      <LocationHeader
        location={sectionName}
        details={`${floor} ${strings('LOCATION.ITEMS')}, ${reserve} ${strings('LOCATION.PALLETS')}`}
      />
    </View>
  );
};

const LocationDetails = (): JSX.Element => {
  const sectionName = useTypedSelector(state => state.Location.selectedSection.name);

  return (
    <>
      <LocationDetailsScreen
        sectionName={sectionName}
        mockData={mockLocationDetails}
      />
      <LocationTabs
        mockData={mockLocationDetails}
      />
    </>
  );
};

export default LocationDetails;
