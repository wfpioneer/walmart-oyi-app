import React, {
  FC, RefObject, createRef, useLayoutEffect
} from 'react';
import { TextInput, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { strings } from '../../locales';
import styles from './ManualScan.style';
import COLOR from '../../themes/Color';
import { manualScan } from '../../utils/scannerUtils';
import Button from '../buttons/Button';
import { setManualScan } from '../../state/actions/Global';
import IconButton from '../buttons/IconButton';
import { ModalCloseIcon } from '../../screens/Modal/Modal';

interface ManualScanProps {
  keyboardType?: 'numeric' | 'default';
}
const defaultProps: ManualScanProps = {
  keyboardType: 'numeric'
};

const ManualScanComponent: FC<ManualScanProps> = (props = defaultProps) => {
  const dispatch = useDispatch();
  const [value, onChangeText] = React.useState('');
  const textInputRef: RefObject<TextInput> = createRef();
  const itemRegex = new RegExp(/[^0-9]/g);

  const onSubmit = (text: string) => {
    if (text.length > 0) {
      manualScan(text);
      dispatch(setManualScan(false));
    }
  };

  const clearText = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={textInputRef}
        style={styles.textInput}
        value={value}
        onChangeText={(text: string) => onChangeText(text.replace(itemRegex, ''))}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')}
        onSubmitEditing={(event: any) => onSubmit(event.nativeEvent.text)}
        keyboardType={props.keyboardType}
        autoFocus={true}
      />
      {value.length > 0 && value !== '' && (
        <IconButton
          icon={ModalCloseIcon}
          type={Button.Type.NO_BORDER}
          onPress={clearText}
        />
      )}
    </View>
  );
};
ManualScanComponent.defaultProps = defaultProps;
export default ManualScanComponent;
