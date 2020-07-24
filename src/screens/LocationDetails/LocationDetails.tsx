import React from "react";
import styles from "./LocationDetails.style";
import { View, SafeAreaView, Text } from "react-native";
import LocationDetailsCard from "../../components/locationdetailscard/LocationDetailsCard";
import { strings } from '../../locales';
import Location from '../../models/Location';
import { useRoute } from "@react-navigation/native";

export interface Props {
    floorLocs?: [Location],
    resLocs?: [Location]
};

//TODO: Validate functionality, attach to the rest of the project.  THIS IS NOT COMPLETE AND NOT READY FOR MERGER.

function LocationDetails(props:Props) {
    const floorList=(props.floorLocs?props.floorLocs:[]);
    console.log(props.floorLocs?.length);
    console.log(floorList);
    const resList=(props.resLocs?props.resLocs:[]);
    const displayFloorLocs = (props.floorLocs&&props.floorLocs.length>0)?createLocations(floorList):<View></View>;
    const displayReserveLocs = (props.resLocs&&props.resLocs.length>0)?createLocations(resList):<View></View>;
    function createLocations(locationList : [Location]) {
        locationList.forEach(element => {
            return (
            <LocationDetailsCard locationName={element.name} locationType={element.type} />
            );
        });
    };
    return(
        <SafeAreaView>
            {props.floorLocs?<View style={styles.sectionLabel}><Text>{strings(LOCATION.FLOOR)} ({props.floorLocs.length})</Text></View>:<View></View>}
            {displayFloorLocs}
            {props.resLocs?<View style={styles.sectionLabel}><Text>{strings(LOCATION.RESERVE)} ({props.resLocs.length})</Text></View>:<View></View>}
            {displayReserveLocs}
        </SafeAreaView>
    );
};

export default LocationDetails;