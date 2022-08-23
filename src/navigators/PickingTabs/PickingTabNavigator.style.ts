import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  quickPickBadge: {
    marginTop: 4,
    marginRight: 4,
    elevation: 5
  },
  badge: {
    marginTop: 4,
    marginRight: 4,
    backgroundColor: COLOR.GREY_400,
    color: COLOR.BLACK,
    elevation: 5
  }
});

export default styles;
