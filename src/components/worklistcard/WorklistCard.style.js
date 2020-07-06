import {StyleSheet} from 'react-native';
import { COLOR } from '../../themes/Color';

const styles=StyleSheet.create({
    card: {
        margin: 4,
        padding:6,
        borderColor: COLOR.GRAY,
        borderRadius:3,
        borderWidth:1,
        width: "95%"
    },
    head: {
        flexDirection: "row"
    },
    title: {
        flex:1
    },
    progress: {
        textAlign: "right",
        fontWeight: "bold",
        flex:1
    },
    counter: {
        color: COLOR.TRAINING_BLUE,
        textAlign:"right",
        fontWeight:"bold"
    },
    progressBar: {
        flexDirection: "row",
        height:15,
        width:"100%",
        backgroundColor: COLOR.LIGHT_GRAY,
        borderRadius:10,
        borderColor: COLOR.BLACK,
        borderWidth: 1
    },
    barFillAtGoal: {
        backgroundColor: COLOR.GREY_800
    },
    barFillNotAtGoal: {
        backgroundColor: COLOR.RED
    }
});

export default styles;