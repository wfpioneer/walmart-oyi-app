import { StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Color';


const styles = StyleSheet.create({
  averageContainer: {
    alignItems: 'center',
    padding: 8,
    marginTop: 12
  },
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
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.GREY_100
  },
  averageQtyNbr: {
    fontSize: 32
  },
  averageQtyLabel: {
    fontSize: 12,
    color: COLOR.GREY_600
  }
})

export default styles;
