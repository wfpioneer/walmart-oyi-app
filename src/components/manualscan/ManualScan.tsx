import React, {
  FC, RefObject, createRef, useLayoutEffect
} from 'react';
import { TextInput, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { strings } from '../../locales';
import styles from './ManualScan.style';
import COLOR from '../../themes/Color';
import { manualScan } from '../../utils/scannerUtils';
import Button from '../buttons/Button';
import { setManualScan } from '../../state/actions/Global';
import IconButton from '../buttons/IconButton';
import { showSnackBar } from '../../state/actions/SnackBar';

interface ManualScanProps {
  keyboardType?: 'numeric' | 'default';
}
const defaultProps: ManualScanProps = {
  keyboardType: 'numeric'
};

const ManualScanComponent: FC<ManualScanProps> = (props = defaultProps) => {
  const dispatch = useDispatch();
  const [value, onChangeText] = React.useState('');
  const isNavigationFocused = useIsFocused();
  const textInputRef: RefObject<TextInput> = createRef();
  const itemRegex = new RegExp(/^[0-9]*$/);
  // Having to use this to get focus correct past the first screen where this gets shown
  useLayoutEffect(() => {
    if (isNavigationFocused) {
      textInputRef.current?.focus();
    }
  }, [isNavigationFocused]);

  const onSubmit = (text: string) => {
    if (text.length > 0 && value.match(itemRegex)) {
      manualScan(text);
      dispatch(setManualScan(false));
    } else {
      dispatch(showSnackBar(strings('GENERICS.ENTER_UPC_ITEM_NBR_ERROR'), 3000));
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
        onChangeText={(text: string) => onChangeText(text)}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')}
        onSubmitEditing={(event: any) => onSubmit(event.nativeEvent.text)}
        keyboardType={props.keyboardType}
      />
      {value.length > 0 && value !== '' && (
        <IconButton
          icon={<MaterialCommunityIcon name="close" size={16} color={COLOR.GREY_500} />}
          type={Button.Type.NO_BORDER}
          onPress={clearText}
        />
      )}
    </View>
  );
};
ManualScanComponent.defaultProps = defaultProps;
export default ManualScanComponent;
