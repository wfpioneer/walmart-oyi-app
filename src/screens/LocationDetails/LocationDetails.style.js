import {StyleSheet} from "react-native";
import {COLOR} from "../../themes/Color";

const styles=StyleSheet.create({
    sectionLabel: {
        height: 70,
        width: "100%",
        backgroundColor: COLOR.GREY_300,
        alignContent: "center",
        justifyContent: "center",
        padding:10
    },
    labelText: {
        fontWeight: "bold"
    }
});

export default styles;