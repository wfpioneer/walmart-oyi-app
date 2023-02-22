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
  },
  confirmText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10
  },
  modalQuantityRow: {
    flexDirection: 'row',
    width: '90%',
    borderBottomColor: COLOR.GREY_500,
    borderBottomWidth: 1,
    justifyContent: 'space-evenly',
    paddingVertical: 5
  },
  updatedQtyRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
    marginBottom: 5
  },
  rowQuantityTitle: {
    flex: 1
  },
  rowQuantity: {
    fontSize: 15
  },
  negativeChange: {
    fontSize: 15,
    alignSelf: 'flex-start',
    color: COLOR.RED_550,
    marginLeft: 30
  },
  positiveChange: {
    fontSize: 15,
    alignSelf: 'flex-start',
    color: COLOR.GREEN,
    marginLeft: 30
  }
});
