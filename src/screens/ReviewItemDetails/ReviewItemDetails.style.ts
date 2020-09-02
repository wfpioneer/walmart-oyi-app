import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';


const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  scanForNoActionButton: {
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 15
  },
  buttonText: {
    color: COLOR.WHITE
  }
});

export default styles;
