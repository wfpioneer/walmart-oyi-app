import React, { FC, RefObject, createRef } from 'react';
import { TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import styles from './ManualScan.style';
import COLOR from '../../themes/Color';
import { manualScan } from '../../utils/scannerUtils';
import { setManualScan } from '../../state/actions/Global';
import IconButton, { IconButtonType } from '../buttons/IconButton';
import { ModalCloseIcon } from '../../screens/Modal/Modal';

interface ManualScanProps {
  keyboardType?: 'numeric' | 'default';
  placeholder?: string
}
const defaultProps: ManualScanProps = {
  keyboardType: 'numeric',
  placeholder: ''
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
        onChangeText={(text: string) => props.keyboardType === 'numeric'
          ? onChangeText(text.replace(itemRegex, ''))
          : onChangeText(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={props.placeholder}
        onSubmitEditing={(event: any) => onSubmit(event.nativeEvent.text)}
        keyboardType={props.keyboardType}
        autoFocus={true}
      />
      {value.length > 0 && value !== '' && (
        <IconButton
          icon={ModalCloseIcon}
          type={IconButtonType.NO_BORDER}
          onPress={clearText}
        />
      )}
    </View>
  );
};
ManualScanComponent.defaultProps = defaultProps;
export default ManualScanComponent;
