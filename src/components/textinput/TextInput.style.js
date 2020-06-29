import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    left: 0,
    fontSize: 16,
    paddingHorizontal: 8
  },
  placeholderOutlined: {
    top: 12,
    zIndex: 1
  },
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0
  },
  outlinedLabelBackground: {
    position: 'absolute',
    top: -4,
    left: 8,
    paddingHorizontal: 4
  },
  input: {
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingBottom: 4,
    fontSize: 16,
    height: 44
  },
  inputOutlined: {
    paddingTop: 8
  },
  errorTxtLabel: {
    marginTop: 4,
    marginLeft: 4
  },
  errorTxt: {
    color: COLOR.ORANGE_LOWLIGHT,
    fontSize: 12
  }
});

export default styles;
