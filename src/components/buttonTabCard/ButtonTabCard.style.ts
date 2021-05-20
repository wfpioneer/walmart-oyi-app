import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  mainBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: COLOR.WHITE,
    alignContent: 'center',
    height: 80,
    elevation: 10
  },
  rejectButton: {
    width: '45%',
    borderColor: COLOR.MAIN_THEME_COLOR,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    alignSelf: 'center'
  },
  approveButton: {
    width: '45%',
    alignSelf: 'center'
  }
});

export default styles;
