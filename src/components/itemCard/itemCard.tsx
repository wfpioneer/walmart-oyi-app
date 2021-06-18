import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './itemCard.style';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {strings} from '../../locales';
import {COLOR} from '../../themes/Color';


const ItemCard = (props: any) => {
    const {zoneName, aisleCount} = props;
    return (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemContainer}>
                <View style={styles.categoryText}> 
                    <Text>{zoneName}</Text>
                    <View>
                        <Text style={styles.aisleText}> {aisleCount} {strings("LOCATION.AISLES")}</Text>
                    </View>
               </View>
               <View style={styles.arrowIcon}>  
                    <MaterialCommunityIcon name="greater-than" size={18} color={COLOR.TIP_BLUE}/>
               </View>
            </View>
        </TouchableOpacity>
        )
} 

export default ItemCard;