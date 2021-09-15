import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  activityView: {
    alignContent: 'center',
    alignSelf: 'center',
    height: 50,
    width: 50,
    backgroundColor: COLOR.WHITE,
    borderRadius: 5,
    justifyContent: 'center'
  },
  infoView: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 5,
    justifyContent: 'center',
    padding: 15
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20
  },
  normalText: {
    textAlign: 'center'
  },
  okButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    height: 30,
    borderRadius: 4
  },
  okText: {
    color: COLOR.WHITE
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK_TRANSPARENT_600
  },
  errorContainer: {
    width: '80%',
    borderRadius: 10,
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.TRACKER_GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center',
    minHeight: 150
  },
  contentContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 7.5,
    paddingVertical: 12,
    paddingHorizontal: 8
  }
});
