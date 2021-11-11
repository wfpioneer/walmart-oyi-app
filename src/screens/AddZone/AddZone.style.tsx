import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
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
    fontSize: 16,
    textAlignVertical: 'center'
  },
  continueButton: {
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    borderRadius: 4,
    borderColor: COLOR.MAIN_THEME_COLOR,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 15
  },
  buttonText: {
    color: COLOR.WHITE,
    textAlign: 'center'
  },
  bodyContainer: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 0.9
  },
  buttonContainer: {
    flex: 0.1
  }
});
