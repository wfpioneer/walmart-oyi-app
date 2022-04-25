import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.RED_300,
    borderRadius: 4,
    height: 40,
    width: '100%'
  },
  errorText: {
    marginVertical: 10,
    textAlign: 'center'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  actionButtonsView: {
    flexDirection: 'row',
    marginTop: 'auto',
    width: '100%',
    borderTopColor: COLOR.GREY_400,
    borderTopWidth: 2
  },
  actionButton: {
    flex: 1,
    margin: 5
  },
  updateQuantityTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  updateQuantityText: {
    fontSize: 13
  }
});

export default styles;
