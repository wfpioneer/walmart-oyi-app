import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLOR.WHITE
  },
  titleContainer: {
    flexDirection: 'column',
    flex: 0.4,
    justifyContent: 'center',
    marginHorizontal: 15
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.MIDNIGHT
  },
  quantityContainer: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'flex-start'
  },
  itemQtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.GREY_700,
    marginBottom: 5
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  updateErrorContainer: {
    width: '80%',
    borderRadius: 10,
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.TRACKER_GREY,
    borderStyle: 'solid',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center',
    minHeight: 150
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  iconPosition: {
    alignSelf: 'center'
  },
  dismissButton: {
    width: '70%',
    marginTop: 16
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center'
  }
});

export default styles;
