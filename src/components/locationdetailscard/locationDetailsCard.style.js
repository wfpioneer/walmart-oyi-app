import {StyleSheet} from "react-native";
import {COLOR} from "../../themes/Color";

const styles=StyleSheet.create ({
    card: {
        width: "100%",
        height: 100,
        backgroundColor: COLOR.WHITE,
        borderBottomColor: COLOR.GREY_300,
        paddingLeft: 50,
        flexDirection: "row"
    },
    location: {
        textAlignVertical: "center",
        textTransform: "uppercase",
        color: COLOR.TRACKER_GREY,
        flex: 8
    },
    icon: {
        alignItems: "center",
        flex: 1
    }
});

export default styles;