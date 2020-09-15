import React from "react";
import styles from "./locationDetailsCard.style";
import {View, Text, TouchableOpacity, GestureResponderEvent} from "react-native";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR} from "../../themes/Color";
import Location from "../../models/Location";

export interface Props {
  locationName: string,
  locationType: string,
  editAction?(event: GestureResponderEvent): void,
  deleteAction?(event: GestureResponderEvent): void
}

function locationDetailsCard(props: Props) {
  const renderIcon = (name: string, action?: (event: GestureResponderEvent)=> void) => {
    return (
      <TouchableOpacity style={styles.icon} onPress={action}>
        <View>
          < MaterialCommunityIcon name={name} size={20} color={COLOR.TRACKER_GREY}/>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.card}>
      <View style={styles.location}>< Text style={styles.locationName}>{props.locationName}</Text></View>
      {props.locationType !== "Reserve" && renderIcon('pencil', props.editAction)}
      {props.locationType !== "Reserve" && renderIcon('trash-can', props.deleteAction)}
    </View>
  )
};

export default locationDetailsCard;