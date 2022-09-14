import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 0,
    left: 0
  },
  wrapperContainer: {
    marginHorizontal: 5
  },
  baseRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLOR.GREY_300,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10
  },
  halfRing: {
    width: 40,
    height: 80,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
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
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  goalDisp: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20
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
