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
    position: 'relative'
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: COLOR.NAVIGATION_DEFAULT_BACKGROUND,
    top: -12,
    left: 15,
    paddingVertical: 1,
    paddingHorizontal: 5,
    zIndex: 50
  },
  labelText: {
    fontSize: 12,
    color: COLOR.GREY
  },
  aisleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 10
  },
  aisleNumericContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20
  },
  aisleText: {
    fontSize: 16,
    textAlignVertical: 'center'
  },
  aisleSeparator: {
    backgroundColor: COLOR.GREY_300,
    width: '100%',
    height: 2
  },
  doneButton: {
    margin: 15
  },
  bodyContainer: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 0.9,
    marginTop: 5
  },
  buttonContainer: {
    flex: 0.1,
    marginBottom: 15
  },
  invalidLabel: {
    fontSize: 10,
    color: COLOR.RED_900,
    marginBottom: 12,
    textAlign: 'right'
  }
});
