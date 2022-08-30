import { StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const styles = StyleSheet.create({
  quickPickBadge: {
    marginTop: 2,
    marginRight: 2,
    elevation: 5
  },
  badge: {
    marginTop: 2,
    marginRight: 2,
    backgroundColor: COLOR.GREY_400,
    color: COLOR.BLACK,
    elevation: 5
  },
  tabBarStyle: {
    borderEndWidth: 0.5,
    borderColor: COLOR.GREY_500
  }
});

export default styles;
