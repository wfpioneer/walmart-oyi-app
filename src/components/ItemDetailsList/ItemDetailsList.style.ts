import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10
  },
  listRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopColor: COLOR.GREY_300
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingLeft: 10
  },
  infoIcon: {
    paddingRight: 6
  }
});

export default styles;
