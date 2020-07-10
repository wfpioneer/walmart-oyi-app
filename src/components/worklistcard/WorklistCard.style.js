import {StyleSheet} from 'react-native';
import { COLOR } from '../../themes/Color';

const styles=StyleSheet.create({
    card: {
        margin: 4,
        padding:6,
        elevation: 2,
        borderRadius: 10,
        backgroundColor: COLOR.WHITE,
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
        textAlign:"right"
    },
    progressBar: {
        flexDirection: "row",
        height:10,
        width:"100%",
        backgroundColor: COLOR.GREY_300,
        borderRadius:10,
        marginTop: 5,
        marginBottom: 5
    },
    barFillAtGoal: {
        backgroundColor: "#545F7A",
        borderRadius:10
    },
    barFillNotAtGoal: {
        backgroundColor: "#D6512D",
        borderRadius:10
    }
});

export default styles;