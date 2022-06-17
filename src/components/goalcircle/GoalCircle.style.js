import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0
  },
  wrapperContainer: {
    marginHorizontal: 20
  },
  baseRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLOR.GREY_300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  halfRing: {
    width: 50,
    height: 100,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    position: 'absolute',
    top: 0,
    left: 0
  },
  goalNotMet: {
    backgroundColor: COLOR.TRACKER_RED
  },
  goalMet: {
    backgroundColor: COLOR.GREEN
  },
  under50: {
    backgroundColor: COLOR.GREY_300
  },
  centerRing: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  goalDisp: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 25
  },
  freq: {
    color: COLOR.GREY_500,
    textAlign: 'center',
    padding: 5
  },
  goalNameActive: {
    backgroundColor: COLOR.TRAINING_BLUE,
    height: 30,
    width: 100,
    borderRadius: 30,
    color: COLOR.WHITE,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  goalNameInactive: {
    backgroundColor: COLOR.GREY_300,
    height: 30,
    width: 100,
    borderRadius: 30,
    color: COLOR.TRAINING_BLUE,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

export default styles;
