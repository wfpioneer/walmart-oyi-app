import {StyleSheet} from "react-native";
import {COLOR} from "../../themes/Color";

const containers=StyleSheet.create({
    horizontalContainer: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: COLOR.WHITE,
        padding: 10,
        justifyContent: "space-between"
    }
});

export default containers;