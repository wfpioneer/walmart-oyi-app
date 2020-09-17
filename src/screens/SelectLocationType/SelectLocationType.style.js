import { StyleSheet } from 'react-native';
import {COLOR} from "../../themes/Color";

const styles = StyleSheet.create({
  instructionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5
  },
  instructionCompletedLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    color: 'green'
  },
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
  manualcontainer: {
    width: '50%',
    flex: 1,
    padding: 10
  },
  container: {
    width: '100%',
    flex: 1,
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
    textAlign: 'center'
  },
  locationContainer: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  }
});

export default styles;
