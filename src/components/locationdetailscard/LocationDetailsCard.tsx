import React from "react";
import styles from "./locationDetailsCard.style";
import {View, Text, TouchableOpacity} from "react-native";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR} from "../../themes/Color";

export interface Props {
  locationName: string,
  locationType: string,
  editAction?(): void,
  deleteAction?(): void
}

function locationDetailsCard(props: Props) {
  const renderIcon = (name: string, action?: ()=> void) => {
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
      {renderIcon('trash-can', props.deleteAction)}
    </View>
  )
};

export default locationDetailsCard;