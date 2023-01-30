import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  buttonWrapper: {
    marginVertical: 10,
    marginHorizontal: 15
  },
  separator: {
    backgroundColor: COLOR.GREY_300,
    height: 2,
    width: '100%'
  },
  scrollViewContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: 6
  },
  marginBottomStyles: {
    marginBottom: 6
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
    flexDirection: 'row',
    paddingTop: 10
  },
  button: {
    flex: 1,
    paddingHorizontal: 10
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    padding: 15
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
