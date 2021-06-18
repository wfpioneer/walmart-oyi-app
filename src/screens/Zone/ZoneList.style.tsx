import React from 'react';
import { StyleSheet} from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      backgroundColor: '#fcfcfc',
      padding: 14,
      marginVertical: 1,
      marginHorizontal: 0,
    },
    staticHeader: {
      backgroundColor: '#fcfcfc',
      padding: 14,
      marginHorizontal: 0,
      zIndex: 2,
      borderBottomWidth: 2,
      borderBottomColor: '#dbdbdb'
      },
      aisleText: {
      color: '#b5b5b5',
      fontSize: 12,
      },
    title: {
      fontSize: 40,
    },
    itemContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: 'center'
    }
  });
  
  export default styles