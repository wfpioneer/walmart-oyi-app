import React from 'react';
import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import styles from './ZoneList.style' 
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {Zones} from '../../mockData/zoneDetails';
import {ZoneItem} from '../../models/ZoneItem';
import ItemCard from  '../../components/itemCard/itemCard'



const ZoneList = () => {
    const siteId = useTypedSelector(state => state.User.siteId)
    return (<ZoneScreen zoneList={Zones} siteId = {siteId}/>)
}

interface ZoneProps {
    siteId: number,
    zoneList: ZoneItem[]
}

export const ZoneScreen = (props: ZoneProps) => {
    const siteId = props.siteId;
    const zoneList = props.zoneList;

    return (
        <View>
            <View style={styles.staticHeader}>
                <Text>CLUB {siteId}</Text>
            </View>
           <FlatList
                data={zoneList}
                renderItem={(item) => {
                return <ItemCard zone = {item} />
                }}
                keyExtractor={item => item.zoneName}
            />
        </View>
      );

}

export default ZoneList;
