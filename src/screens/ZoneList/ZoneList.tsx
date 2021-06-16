import React from 'react';
import { SafeAreaView, View, FlatList, Text, TouchableOpacity} from 'react-native';
import itemData from "../../mockData/getItemDetails";
import styles from './ZoneList.style' 
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTypedSelector } from '../../state/reducers/RootReducer';


const dataset_one = [
    {
     "id": 1,
     "category": "B - Backroom",
     "aisles" : 4   
    },
    {
    "id": 2,
    "category": "C - Center",
    "aisles" : 2   
    },
    {
    "id": 3,
    "category": "E - Electronics",
    "aisles" : 6   
    },
    {
    "id": 4,
    "category": "FB - Fresh Bakery",
    "aisles" : 5  
    },
]
const ItemCard = (item: { category: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal 
    | null | undefined; aisles: string | number | boolean | {} | React.ReactElement<any, string 
    | React.JSXElementConstructor<any>> | React.ReactNodeArray | React.ReactPortal | null | undefined; }) => {
    return (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemContainer}>
                <View style={{flex:8}}> 
                     <Text>{item.category}</Text>
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

    return (
        <>
        <View style={styles.staticHeader}>
        <Text>CLUB {siteId}</Text>
        </View>
          <FlatList
            data={dataset_one}
            renderItem={({item}) => {
                return ItemCard(item)
            }}
            keyExtractor={item => item.category}/>
        </>
      );

}

export default ZoneList;
