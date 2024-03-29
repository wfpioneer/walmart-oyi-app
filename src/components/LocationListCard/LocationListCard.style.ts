import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: COLOR.GREY_300,
    backgroundColor: COLOR.WHITE
  },
  title: {
    fontWeight: 'bold'
  },
  subText: {
    fontSize: 12
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleFlex: {
    flex: 1
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
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  locationCard: {
    marginBottom: 2
  },
  nolocation: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 2,
    backgroundColor: COLOR.WHITE
  }
});

export default styles;
