import React, { Dispatch, RefObject, createRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { manualScan } from '../../utils/scannerUtils';
import { setManualScan } from '../../state/actions/Global';
import IconButton, { IconButtonType } from '../buttons/IconButton';
import { ModalCloseIcon } from '../../screens/Modal/Modal';
import styles from './LocationManualScan.style';

interface LocManualScanProps {
  keyboardType?: 'numeric' | 'default';
  dispatch: Dispatch<any>;
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  textInputRef: RefObject<TextInput>;
}

const defaultProps: Pick<LocManualScanProps, 'keyboardType'> = {
  keyboardType: 'numeric'
};
const locRegex = new RegExp(/^[\d]+$|[A-z][0-9]+-[0-9]+$/);

export const onSubmit = (text: string, dispatch: Dispatch<any>): void => {
  if (text.length > 0 && locRegex.test(text)) {
    manualScan(text);
    dispatch(setManualScan(false));
  }
};

export const LocationManualScanComponent = (props: LocManualScanProps): JSX.Element => {
  const {
    dispatch, value, onChangeText, textInputRef, keyboardType
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={value}
          onChangeText={(text: string) => onChangeText(text)}
          selectionColor={COLOR.MAIN_THEME_COLOR}
          placeholder={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
          onSubmitEditing={(event: any) => {
            onSubmit(event.nativeEvent.text, dispatch);
          }}
          keyboardType={keyboardType}
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize="characters"
        />
        {value.length > 0 && value !== '' && (
        <IconButton
          icon={ModalCloseIcon}
          type={IconButtonType.NO_BORDER}
          onPress={() => onChangeText('')}
        />
        )}
      </View>
      {(!locRegex.test(value) && value.length > 0) && (
        <View style={styles.alertView}>
          <MaterialCommunityIcons name="alert-circle" size={20} color={COLOR.RED_400} />
          <Text style={styles.errorText}>
            {strings('LOCATION.SCAN_LOCATION')}
          </Text>
        </View>
      )}
    </View>
  );
};

const LocationManualScan = (props: Pick<LocManualScanProps, 'keyboardType'>): JSX.Element => {
  const { keyboardType } = props;
  const dispatch = useDispatch();
  const [value, onChangeText] = React.useState('');
  const textInputRef: RefObject<TextInput> = createRef();

  return (
    <LocationManualScanComponent
      keyboardType={keyboardType}
      dispatch={dispatch}
      value={value}
      onChangeText={onChangeText}
      textInputRef={textInputRef}
    />
  );
};

LocationManualScan.defaultProps = defaultProps;
LocationManualScanComponent.defaultProps = defaultProps;
export default LocationManualScan;
