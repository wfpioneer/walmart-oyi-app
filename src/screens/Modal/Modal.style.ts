import { StyleSheet } from 'react-native';
import COLOR from "../../themes/Color";

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
  }
});
