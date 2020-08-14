import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    typeListItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 5
    },
    typeLabel: {
        textAlignVertical: "center",
        fontSize: 16,
        paddingLeft: 5
    },
    labelBox: {
        alignSelf: "center"
    },
    container: {
        width: "100%",
        flex: 1,
        justifyContent: "flex-end",
        padding:10
    }
});

export default styles;