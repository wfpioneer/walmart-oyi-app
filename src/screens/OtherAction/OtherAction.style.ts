import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  menuCard: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_300
  },
  selectionView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '10%'
  },
  completeActionCard: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    height: 50,
    marginVertical: 5
  },
  completeActionRadioView: {
    justifyContent: 'space-evenly',
    flex: 1,
    alignContent: 'flex-end'
  },
  completeActionTitle: {
    width: '90%',
    fontSize: 16
  },
  completeActionSubText: {
    width: '90%',
    fontSize: 12,
    color: COLOR.GREY_500
  },
  desiredActionText: {
    alignSelf: 'center',
    width: '90%',
    marginVertical: 5,
    color: COLOR.GREY_500
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLOR.WHITE,
    alignContent: 'center',
    height: 70,
    elevation: 50
  },
  continueButton: {
    alignSelf: 'center'
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_300
  }
});
