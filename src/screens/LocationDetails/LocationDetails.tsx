import React from "react";
import styles from "./LocationDetails.style";
import { View, SafeAreaView, Text } from "react-native";
import LocationDetailsCard from "../../components/locationdetailscard/LocationDetailsCard";
import { strings } from '../../locales';
import Location from '../../models/Location';
import { useRoute } from "@react-navigation/native";

//TODO: Validate functionality, attach to the rest of the project.  THIS IS NOT COMPLETE AND NOT READY FOR MERGER.

export interface locationProps {
    floorLoc?: [Location],
    resLoc?: [Location]
  };

function LocationDetails() {
    const route=useRoute();
    console.log(route)
    const locProps:locationProps = route.params?route.params:{};
    const floorList=(locProps.floorLoc?locProps.floorLoc:[]);
    console.log(route.params);
    const resList=(locProps.resLoc?locProps.resLoc:[]);
    const displayFloorLocs = (locProps.floorLoc&&locProps.floorLoc.length>0)?createLocations(floorList):<View></View>;
    const displayReserveLocs = (locProps.resLoc&&locProps.resLoc.length>0)?createLocations(resList):<View></View>;
    function createLocations(locationList:[Location]) {
        locationList.forEach(element => {
            return (
            <LocationDetailsCard locationName={element.name} locationType={element.type} />
            );
        });
    };
    return(
        <SafeAreaView>
            {locProps.floorLoc?<View style={styles.sectionLabel}><Text>{strings('LOCATION.FLOOR')} ({locProps.floorLoc.length})</Text></View>:<View></View>}
            {displayFloorLocs}
            {locProps.resLoc?<View style={styles.sectionLabel}><Text>{strings('LOCATION.RESERVE')} ({locProps.resLoc.length})</Text></View>:<View></View>}
            {displayReserveLocs}
        </SafeAreaView>
    );
};

export default LocationDetails;