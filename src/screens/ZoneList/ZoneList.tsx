import React from 'react';
import { SafeAreaView, View, FlatList, Text, TouchableOpacity} from 'react-native';
import itemData from "../../mockData/getItemDetails";
import styles from './ZoneList.style' 
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { Provider } from 'react-redux';
import {dataset_one, DataSetOne} from "../../mockData/zoneDetails";




const ItemCard = (item: DataSetOne) => {
    return (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemContainer}>
                <View style={{flex:8}}> 
                     <Text>{item.code} - {item.category}</Text>
                    <View>
                    <Text style={styles.aisleText}> {item.aisles} aisles</Text>
                    </View>
               </View>
               <View style={{flex:1}}>  
                    <MaterialCommunityIcon name="greater-than" size={18} color="#349beb"/>
               </View>
            </View>
        </TouchableOpacity>
        )
} 

const ZoneList = () => {
    const siteId = useTypedSelector(state => state.User.siteId)
    return (<ZoneListScreen dataSet={dataset_one} siteId = {siteId}/>)
}



interface ZoneListProps {
    siteId: number,
    dataSet: DataSetOne[]
}

export const ZoneListScreen = (props: ZoneListProps) => {
    const siteId = props.siteId;
    const data_set = props.dataSet;

    return (
        <>
        <View style={styles.staticHeader}>
        <Text>CLUB {siteId}</Text>
        </View>
          <FlatList
            data={data_set}
            renderItem={({item}) => {
                return ItemCard(item)
            }}
            keyExtractor={item => item.category}/>
        </>
      );

}

export default ZoneList;
