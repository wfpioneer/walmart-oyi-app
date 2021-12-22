import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

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
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  },
  labelText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  locationText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 10
  },
  locationContainer: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
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
    width: '50%'
  },
  activityIndicator: {
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
