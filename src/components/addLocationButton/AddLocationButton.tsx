import React from "react";
import { View, StyleSheet } from "react-native";
import styles from "./AddLocationButton.style";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLOR } from "../../themes/Color";
import { TouchableOpacity } from "react-native-gesture-handler";

export const AddLocationButton = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <MaterialCommunityIcon style={styles.button} name="plus-circle" size={50} color={COLOR.MAIN_THEME_COLOR} />
            </TouchableOpacity>
        </View>
    );
}