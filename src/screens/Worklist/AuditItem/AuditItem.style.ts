import { StyleSheet } from 'react-native';
import COLOR from '../../../themes/Color';

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  completeActivityIndicator: {
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
  marginBottomStyle: {
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
  itemCardContainer: {
    marginBottom: 8
  },
  confirmText: {
    fontWeight: 'bold',
    fontSize: 16
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
  },
  footer: {
    height: 60,
    borderTopWidth: 4,
    borderTopColor: COLOR.GREY_200
  }
});

export default styles;
