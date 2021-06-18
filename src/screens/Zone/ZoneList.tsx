import React from 'react';
import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import styles from './ZoneList.style';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import {Zones} from '../../mockData/zoneDetails';
import {ZoneItem} from '../../models/ZoneItem';
import ItemCard from  '../../components/itemCard/itemCard';
import {strings} from '../../locales';

const NoZonesMessage = () => {
    return (
    <View style={styles.noZones}>
        <Text>{strings("LOCATION.NO_ZONES_AVAILABLE")}</Text>
    </View>
    )
}

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
                <Text>{strings("GENERICS.CLUB")} {siteId}</Text>
                <Text style={styles.areas}>{zoneList.length} {strings("LOCATION.AREAS")} </Text>
            </View>
           <FlatList
                data={zoneList}
                renderItem={({item}) => {
                return <ItemCard 
                            zoneName={item.zoneName} 
                            aisleCount={item.aisleCount}
                        />
                }}
                keyExtractor={item => item.zoneName}
                ListEmptyComponent={<NoZonesMessage/>}
            />
        </View>
      );

}

export default ZoneList;
