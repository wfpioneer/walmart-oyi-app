import { StyleSheet} from 'react-native';
import {COLOR} from '../../themes/Color';

const styles = StyleSheet.create({
    item: {
      backgroundColor: COLOR.WHITE,
      padding: 14,
      marginVertical: 1,
      marginHorizontal: 0,
    },
    aisleText: {
      color: COLOR.GREY_500,
      fontSize: 12,
    },
    itemContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: 'center'
    },
    categoryText: {
      flex:8
    },
    arrowIcon: {
      flex: 1
    }
  });
  
  export default styles