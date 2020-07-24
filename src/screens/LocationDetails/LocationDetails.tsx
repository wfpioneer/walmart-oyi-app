import React from "react";
import styles from "./LocationDetails.style";
import { View, SafeAreaView } from "react-native";
import LocationDetailsCard from "../../components/locationdetailscard/LocationDetailsCard";
<<<<<<< HEAD
import { strings } from '../../locales';
=======
import { object, element } from "prop-types";
>>>>>>> a3d66c1f4661caf050d9f88dff065d3c493263af

export interface location {
    id: string,
    type: string,
    name: string
};
export interface Props {
    floorLocCount: number,
    resLocCount: number
    floorLocs?: [location],
    resLocs?: [location]
};

//TODO: Validate functionality, attach to the rest of the project.  THIS IS NOT COMPLETE AND NOT READY FOR MERGER.

function LocationDetails(props:Props) {
    const floorList=(props.floorLocs?props.floorLocs:[]);
    const resList=(props.resLocs?props.resLocs:[]);
    const displayFloorLocs = (props.floorLocCount>0)?createLocations(floorList):'';
    const displayReserveLocs = (props.resLocCount>0)?createLocations(resList):'';
    function createLocations(locationList) {
        locationList.forEach(element => {
            return (
            <LocationDetailsCard locationName={element.name} locationType={element.type} />
            );
        });
    };
    return(
        <SafeAreaView>
<<<<<<< HEAD
            {(props.floorLocCount>0)?<View style={styles.sectionLabel}><text>{strings(LOCATION.FLOOR)} ({props.floorLocCount})</text></View>:''}
            <View>${displayFloorLocs}</View>
            {(props.resLocCount>0)?<View style={styles.sectionLabel}><text>{strings(LOCATION.RESERVE)} ({props.resLocCount})</text></View>:''}
=======
            {(props.floorLocCount>0)?<View style={styles.sectionLabel}><text>Floor locations ({props.floorLocCount})</text></View>:''}
            <View>${displayFloorLocs}</View>
            {(props.resLocCount>0)?<View style={styles.sectionLabel}><text>Reserve locations ({props.resLocCount})</text></View>:''}
>>>>>>> a3d66c1f4661caf050d9f88dff065d3c493263af
            <View>${displayReserveLocs}</View>
        </SafeAreaView>
    );
};

export default LocationDetails;