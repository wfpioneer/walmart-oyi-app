import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  zonePickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLOR.GREY,
    margin: 20
  },
  container: {
    height: 65,
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: COLOR.NAVIGATION_DEFAULT_BACKGROUND,
    top: -12,
    left: 15,
    paddingVertical: 1,
    paddingHorizontal: 5,
    zIndex: 50,
  },
  labelText: {
    fontSize: 12,
    color: COLOR.GREY
  },
  aisleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20
  },
  aisleText: {
    fontSize: 18,
    textAlignVertical: 'center'
  }
});
