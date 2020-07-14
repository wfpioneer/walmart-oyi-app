import {StyleSheet} from 'react-native';
import { COLOR } from '../../themes/Color';

const styles=StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        position: "absolute",
        top:0,
        left:0
    },
    baseRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLOR.GREY_300,
        justifyContent: "center",
        alignItems: "center"
    },
    halfRing: {
        width: 50,
        height: 100,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        position: "absolute",
        top:0,
        left:0
    },
    goalNotMet: {
        backgroundColor: "#D6512D"
    },
    goalMet: {
        backgroundColor: "#545F7A"
    },
    under50: {
        backgroundColor: COLOR.GREY_300
    },
    centerRing: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLOR.WHITE,
        justifyContent: "center",
        alignItems: "center"
    },
    goalDisp: {
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 18,
        fontWeight: "bold"
    },
    freq: {
        color: COLOR.GREY_300,
        textAlign: "center"
    },
    goalNameActive: {
        backgroundColor: COLOR.TRAINING_BLUE,
        height: 25,
        width: 110,
        borderRadius: 25,
        color: COLOR.WHITE,
        textAlign: "center",
        textAlignVertical: "center"
    },
    goalNameInactive: {
        backgroundColor: COLOR.GREY_300,
        height: 25,
        width: 110,
        borderRadius: 25,
        color: COLOR.TRAINING_BLUE,
        textAlign: "center",
        textAlignVertical: "center"
    }
});

export default styles;