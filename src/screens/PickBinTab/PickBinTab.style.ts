import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: COLOR.WHITE
  },
  scanItemLabel: {
    alignItems: 'center',
    backgroundColor: COLOR.GREY_200,
    padding: 10
  },
  cancelButton: {
    width: '50%',
    paddingRight: 12
  },
  acceptButton: {
    width: '50%',
    paddingLeft: 12
  },
  actionRow: {
    flex: 0,
    margin: 12,
    flexDirection: 'row'
  },
  header: {
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    backgroundColor: COLOR.MAIN_THEME_COLOR,
    padding: 12
  },
  headerTitle: {
    fontSize: 18,
    color: COLOR.WHITE
  },
  descriptionText: {
    padding: 12
  },
  pickBinListView: {
    borderWidth: 1,
    maxHeight: 120,
    margin: 12,
    flexGrow: 0
  },
  pickBinItemView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 5
  },
  buttonStyle: {
    width: '100%',
    paddingBottom: 4
  }
});

export default styles;
