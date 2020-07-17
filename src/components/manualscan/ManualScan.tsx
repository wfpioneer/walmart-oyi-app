import React, { createRef, RefObject } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { strings } from '../../locales';
import styles from './ManualScan.style';
import COLOR from '../../themes/Color';
import { manualScan } from '../../utils/scannerUtils';
import Button from '../button/Button';
import { setManualScan } from '../../state/actions/Global';
import { useDispatch } from 'react-redux';

// TODO this needs a lot more work for styling and understanding the desired functionality
const ManualScanComponent = () => {
  const dispatch = useDispatch();
  const [value, onChangeText] = React.useState('');
  const textInputRef: RefObject<TextInput> = createRef();

  const onSubmit = (text: string) => {
    if(text.length > 0) {
      manualScan(text);
      dispatch(setManualScan(false));
    }
  }

  const clearText = () => {
    textInputRef.current && textInputRef.current.clear()
  }

  return (
    <View style={styles.container}>
      <TextInput
        ref={textInputRef}
        style={styles.textInput}
        value={value}
        onChangeText={(text: string) => onChangeText(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')}
        onSubmitEditing={(event: any) => onSubmit(event.nativeEvent.text)}
        keyboardType={'numeric'}
        autoFocus={true}
      />
      {value.length > 0 && <Button
          title={'X'}
          titleColor={COLOR.GREY_500}
          type={3}
          onPress={clearText}
        />
      }
    </View>
  )
}

export default ManualScanComponent;
