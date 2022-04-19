import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
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
  noZones: {
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noZonesText: {
    color: COLOR.GREY_700
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
  bottomSheetModal: {
    borderColor: COLOR.GREY_200,
    borderRadius: 20,
    borderWidth: 2
  },
  iconPosition: {
    alignSelf: 'center'
  },
  buttonContainer: {
    width: '100%',
    alignContent: 'space-around',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  modalButton: {
    flex: 1,
    paddingHorizontal: 10
  }
});

export default styles;
