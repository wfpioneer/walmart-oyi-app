import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';


const styles = StyleSheet.create({
  activityIndicator: {
    marginTop: 10
  },
  container: {
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  safeAreaView: {
    flex: 1
  },
  locationDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_100,
    paddingVertical: 14
  }
});

export default styles;
