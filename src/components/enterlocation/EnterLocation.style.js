import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.BLACK_TRANSPARENT_600
    },
    contentContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.WHITE,
        borderRadius: 7.5,
        paddingBottom: 12,
        paddingHorizontal: 8
    },
    closeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%'
    },
    scanContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: COLOR.WHITE,
        paddingRight: 16
    },
    textInput: {
        flex: 1,
        paddingLeft: 10
    }
});

export default styles;