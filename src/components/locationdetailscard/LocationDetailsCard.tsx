import React from "react";
import styles from "./locationDetailsCard.style";
import { View, Text } from "react-native";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLOR } from "../../themes/Color";

export interface Props {
    locationName: string,
    locationType: string
}

function locationDetailsCard(props:Props) {
    const editable=(props.locationType=="reserve")?<View><Text> </Text></View>:<MaterialCommunityIcon name={'pencil'} size={20} color={COLOR.TRACKER_GREY} />;
    const deletable=(props.locationType=="reserve")?<View><Text> </Text></View>:<MaterialCommunityIcon name={'trash-can'} size={20} color={COLOR.TRACKER_GREY} />;
    return(
        <View style={styles.card}>
            <View style={styles.location}><Text style={styles.locationName}>{props.locationName}</Text></View>
            <View style={styles.icon}>{editable}</View>
            <View style={styles.icon}>{deletable}</View>
        </View>
    )
};

export default locationDetailsCard;