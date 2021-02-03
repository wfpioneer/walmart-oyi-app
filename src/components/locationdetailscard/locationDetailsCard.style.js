import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 70,
    backgroundColor: COLOR.WHITE,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  location: {
    textTransform: 'uppercase',
    flex: 8,
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomColor: COLOR.GREY_300,
    borderBottomWidth: 1
  },
  locationName: {
    color: COLOR.TRACKER_GREY,
    fontWeight: 'bold'
  },
  icon: {
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomColor: COLOR.GREY_300,
    borderBottomWidth: 1
  }
});

export default styles;
