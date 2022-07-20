import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
    flexDirection: 'column'
  },
  menuContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    backgroundColor: COLOR.WHITE
  },
  contentWrapper: {
    flex: 1
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  arrowView: {
    flex: 0.1,
    paddingLeft: 5
  },
  printCardContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_500
  },
  printCardText: {
    fontSize: 16
  },
  changeContainer: {
    justifyContent: 'flex-end'
  },
  changeText: {
    color: COLOR.TRAINING_BLUE
  },
  featureCardContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: COLOR.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLOR.GREY_500
  },
  featureText: {
    paddingTop: 5
  },
  footer: {
    borderBottomWidth: 1
  },
  buttonWrapper: {
    marginVertical: 10,
    marginHorizontal: 15
  }
});
export default styles;
