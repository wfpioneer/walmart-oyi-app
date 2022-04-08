import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  itemDetailsView: {
    padding: 7,
    backgroundColor: COLOR.WHITE
  },
  pickParamView: {
    borderColor: COLOR.GREY,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  pickLocationAddButton: {
    marginLeft: 'auto'
  },
  pickLocationAddText: {
    color: COLOR.MAIN_THEME_COLOR
  },
  pickParamLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 2,
    borderColor: COLOR.GREY,
    height: 60
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLOR.GREY,
    width: '65%'
  },
  createButtonView: {
    padding: 10,
    marginTop: 'auto'
  }
});

export default styles;
