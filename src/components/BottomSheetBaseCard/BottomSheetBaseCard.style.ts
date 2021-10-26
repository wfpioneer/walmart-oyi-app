import { Dimensions, StyleSheet } from 'react-native';
import COLOR from '../../themes/Color';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 75
  },
  touchableOpacity: {
    borderColor: COLOR.GREY_200,
    borderWidth: 1,
    width,
    flexDirection: 'row'
  },
  imageView: {
    height: 75,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 30,
    width: 30
  },
  textView: {
    justifyContent: 'center'
  },
  text: {
    fontSize: 16
  }
});

export default styles;
