import React from "react";
import styles from "./LocationDetails.style";
import { View, SafeAreaView, Text, Keyboard } from "react-native";
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
    const locProps:locationProps = route.params?route.params:{};
    function createLocations(locationList:[Location]) {
        console.log("In createLocations()");
        return (
            <View>
                {locationList.map(cardMaker)}
            </View>
        );
    };
    function cardMaker(loc:Location) {
        return(
            <LocationDetailsCard locationName={loc.name} locationType={loc.type} />
        );
    };
    return(
        <SafeAreaView>
            {locProps.floorLoc?<View style={styles.sectionLabel}><Text style={styles.labelText}>{strings('LOCATION.FLOOR')} ({locProps.floorLoc.length})</Text></View>:<View></View>}
            {locProps.floorLoc?createLocations(locProps.floorLoc):<View></View>}
            {locProps.resLoc?<View style={styles.sectionLabel}><Text style={styles.labelText}>{strings('LOCATION.RESERVE')} ({locProps.resLoc.length})</Text></View>:<View></View>}
            {locProps.resLoc?createLocations(locProps.resLoc):<View></View>}
        </SafeAreaView>
    );
};

export default LocationDetails;