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
  errorText: {
    fontSize: 16,
    textAlign: 'center'
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.RED_300,
    width: '95%',
    borderRadius: 4,
    height: 40,
    marginVertical: 10
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
    backgroundColor: COLOR.WHITE,
    borderRadius: 4,
    borderColor: COLOR.MAIN_THEME_COLOR,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 15
  },
  buttonText: {
    color: COLOR.MAIN_THEME_COLOR
  }
});

export default styles;
