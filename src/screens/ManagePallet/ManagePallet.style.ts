import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

export default StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 5
  },
  headerItem: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerItemText: {
    fontSize: 16
  },
  instructionLabel: {
    borderColor: COLOR.BLACK,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
    alignItems: 'center'
  },
  instructionLabelText: {
    fontSize: 16
  },
  deletedBanner: {
    backgroundColor: COLOR.DEEP_RED,
    padding: 5,
    alignItems: 'center'
  },
  deleteBannerText: {
    fontSize: 16,
    color: COLOR.WHITE
  },
  bodyContainer: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 0.9,
    marginTop: 5
  },
  buttonContainer: {
    flex: 0.1,
    marginBottom: 15
  },
  saveButton: {
    margin: 15
  }
});