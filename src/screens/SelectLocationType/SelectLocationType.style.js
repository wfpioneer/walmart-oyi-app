import { StyleSheet } from 'react-native';
import {COLOR} from "../../themes/Color";

const styles = StyleSheet.create({
  typeListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 5
  },
  typeLabel: {
    textAlignVertical: 'center',
    fontSize: 16,
    paddingLeft: 5
  },
  labelBox: {
    alignSelf: 'center'
  },
  container: {
    width: '100%',
    backgroundColor: COLOR.WHITE,
    justifyContent: 'flex-end',
    padding: 10
  },
  sectionLabel: {
    height: 70,
    width: '100%',
    backgroundColor: COLOR.GREY_300,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  },
  labelText: {
    fontWeight: 'bold'
  },
  locationText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  locationContainer: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10
  },
  errorContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingLeft: 10
  },
  manualButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  manualButton: {
    width: '50%',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: COLOR.RED,
    fontSize: 16
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  }
});

export default styles;
