import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  card: {
    margin: 4,
    padding: 6,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: COLOR.WHITE,
    width: '95%'
  },
  head: {
    flexDirection: 'row'
  },
  title: {
    flex: 2, // Adjusted the flex value to give more space to the title
    overflow: 'hidden'
  },
  progress: {
    textAlign: 'right',
    fontWeight: 'bold',
    flex: 1
  },
  counter: {
    color: COLOR.TRAINING_BLUE,
    textAlign: 'right'
  },
  progressBar: {
    flexDirection: 'row',
    height: 10,
    width: '100%',
    backgroundColor: COLOR.GREY_300,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5
  },
  barFillAtGoal: {
    backgroundColor: COLOR.GREEN,
    borderRadius: 10
  },
  barFillNotAtGoal: {
    backgroundColor: COLOR.TRACKER_RED,
    borderRadius: 10
  },
  barFillInProgress: {
    backgroundColor: COLOR.BRIGHT_YELLOW,
    borderRadius: 10
  },
  barFillNoItems: {
    backgroundColor: COLOR.GREY_300,
    borderRadius: 10
  }
});

export default styles;
