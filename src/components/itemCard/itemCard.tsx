import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './itemCard.style' 
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';


const ItemCard = (props: any) => {
    const zone = props;
    return (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemContainer}>
                <View style={styles.categoryText}> 
                    <Text>{zone.code} - {zone.category}</Text>
                    <View>
                        <Text style={styles.aisleText}> {zone.aisles} aisles</Text>
                    </View>
               </View>
               <View style={styles.arrowIcon}>  
                    <MaterialCommunityIcon name="greater-than" size={18} color="#349beb"/>
               </View>
            </View>
        </TouchableOpacity>
        )
} 

export default ItemCard;