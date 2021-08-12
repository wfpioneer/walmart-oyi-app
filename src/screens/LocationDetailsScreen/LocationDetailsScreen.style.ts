import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginVertical: 1,
    marginHorizontal: 0
  },
  title: {
    fontSize: 40
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noAisles: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
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
  errorText: {
    fontSize: 16,
    textAlign: 'center'
  },
  contentPadding: {
    paddingBottom: 100
  },
  tabHeader: {
    backgroundColor: COLOR.WHITE,
    padding: 14,
    marginHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: COLOR.GREY_200,
    flexDirection: 'row'
  },
  clear: {
    color: COLOR.MAIN_THEME_COLOR,
    paddingRight: 14,
    fontSize: 14
  },
  add: {
    color: COLOR.MAIN_THEME_COLOR,
    paddingLeft: 14,
    fontSize: 14
  },
  tabHeaderText: {
    flex: 1,
    color: COLOR.GREY_600,
    fontSize: 14
  },
  pipe: {
    color: COLOR.GREY_600,
    fontSize: 14
  }
});

export default styles;
