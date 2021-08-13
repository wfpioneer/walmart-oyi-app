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
  zoneName: string,
  aisleName: string,
  sectionName: string,
  mockData: LocationItem
}

export const LocationDetailsScreen = (props: LocationDetailProps) : JSX.Element => {
  const {
    zoneName,
    aisleName,
    sectionName,
    mockData
  } = props;

  const floor = mockData.floor.length;
  const reserve = mockData.reserve.length;

  return (
    <View>
      <LocationHeader
        location={`${strings('LOCATION.SECTION')} ${zoneName}${aisleName}-${sectionName}`}
        details={`${floor} ${strings('LOCATION.ITEMS')}, ${reserve} ${strings('LOCATION.PALLETS')}`}
      />
    </View>
  );
};

const LocationDetails = (): JSX.Element => {
  const sectionName = useTypedSelector(state => state.Location.selectedSection.name);
  const zoneName = useTypedSelector(state => state.Location.selectedZone.name);
  const aisleName = useTypedSelector(state => state.Location.selectedAisle.name);

  return (
    <>
      <LocationDetailsScreen
        zoneName={zoneName}
        aisleName={aisleName}
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
