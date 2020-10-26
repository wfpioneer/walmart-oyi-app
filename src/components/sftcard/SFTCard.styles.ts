import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 8,
    backgroundColor: COLOR.WHITE,
    alignSelf: 'stretch'
  },
  topRowContainer: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_100
  },
  iconTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icon: {
    marginRight: 16
  },
  title: {
    marginLeft: 0
  },
  subTitle: {
    marginLeft: 0,
    fontSize: 10,
    color: COLOR.GREY_500
  },
  bottomRowContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'flex-end'
  },
  bottomRowText: {
    color: COLOR.GREY_600
  },
  bottomRowBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  bottomRowBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomRowDivider: {
    marginLeft: 12,
    marginRight: 12,
    color: COLOR.GREY_500,
    fontSize: 18
  }
});

export default styles;
