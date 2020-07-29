import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK_TRANSPARENT_600
  },
  contentContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    borderRadius: 7.5,
    paddingBottom: 12,
    paddingHorizontal: 8
  },
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  itemDetailsContainer: {
    backgroundColor: COLOR.WHITE,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  copyQtyContainer: {
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  qtyChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6
  },
  signSizeContainer: {
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  printerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE,
    alignItems: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 12
  },
  itemImage: {
    height: 65,
    width: 65,
    resizeMode: 'stretch'
  },
  itemNameTxt: {
    marginHorizontal: 8,
    fontSize: 12,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    flex: 1,
    lineHeight: 16
  },
  copyQtyLabel: {
    marginVertical: 8,
    fontSize: 12,
    color: COLOR.GREY_500
  },
  copyQtyInput: {
    textAlign: 'center',
    minWidth: '15%',
    height: 30,
    fontSize: 12,
    borderColor: COLOR.MAIN_THEME_COLOR,
    borderWidth: 1,
    marginHorizontal: 12,
    padding: 6
  },
  copyQtyInputValid: {
    borderColor: COLOR.MAIN_THEME_COLOR
  },
  copyQtyInputInvalid: {
    borderColor: COLOR.RED_900
  },
  invalidLabel: {
    fontSize: 10,
    color: COLOR.RED_900,
    marginBottom: 12
  },
  signSizeLabel: {
    marginVertical: 8,
    fontSize: 12,
    color: COLOR.GREY_500
  }
});

export default styles;