import { Dimensions, StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  quickPickBadge: {
    marginTop: 2,
    marginRight: 2,
    elevation: 5
  },
  badge: {
    marginTop: 2,
    marginRight: 2,
    backgroundColor: COLOR.GREY_400,
    color: COLOR.BLACK,
    elevation: 5
  },
  tabBarStyle: {
    borderEndWidth: 0.5,
    borderColor: COLOR.GREY_500
  },
  bottomSheetModal: {
    borderColor: COLOR.GREY_200
  },
  sheetContainer: {
    flexDirection: 'row',
    height: 45
  },
  touchableOpacity: {
    borderColor: COLOR.GREY_200,
    borderWidth: 1,
    width,
    flexDirection: 'row'
  },
  textView: {
    justifyContent: 'center',
    flex: 1
  },
  text: {
    fontSize: 16,
    paddingLeft: 20
  }
});

export default styles;
