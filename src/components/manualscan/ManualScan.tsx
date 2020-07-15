import React from 'react';
import { View } from 'react-native';
import { strings } from '../../locales';
import TextInputComponent from '../textinput/TextInput';
import styles from './ManualScan.style';
import COLOR from '../../themes/Color';
import { manualScan } from '../../utils/scannerUtils';
import { useTypedSelector } from '../../state/reducers/RootReducer';

// TODO this needs a lot more work for styling and understanding the desired functionality
const ManualScanComponent = (props: { setManualScanEnabled: Function }) => {
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const [value, onChangeText] = React.useState(scannedEvent.type === 'manual' ? scannedEvent.value : '');

  const onSubmit = (text: string) => {
    manualScan(text);
    props.setManualScanEnabled(false);
  }

  return (
    <View style={styles.container}>
      <TextInputComponent
        style={styles.textInput}
        value={value}
        label={''}
        onChangeText={(text: string) => onChangeText(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')}
        onSubmitEditing={(event: any) => onSubmit(event.nativeEvent.text)}
        keyboardType={'numeric'}
        autoFocus={true}
      />
    </View>
  )
}

export default ManualScanComponent;
