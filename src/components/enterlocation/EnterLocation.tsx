import React, { RefObject, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import styles from './EnterLocation.style';
import IconButton, { IconButtonType } from '../buttons/IconButton';
import Button, { ButtonType } from '../buttons/Button';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import { ModalCloseIcon } from '../../screens/Modal/Modal';

const EnterLocation = (
  props:{ setEnterLocation: React.Dispatch<React.SetStateAction<boolean>>; onSubmit: (value: string) => void }
): JSX.Element => {
  const [textInput, setTextInput] = useState('');

  const textInputRef: RefObject<TextInput> = useRef(null);

  return (
    <>
      <View style={styles.closeContainer}>
        <IconButton
          testID="btnSetEnterLoc"
          icon={ModalCloseIcon}
          type={IconButtonType.NO_BORDER}
          onPress={() => props.setEnterLocation(false)}
        />
      </View>
      <View style={styles.scanContainer}>
        <TextInput
          testID="txtLocation"
          ref={textInputRef}
          style={styles.textInput}
          value={textInput}
          onChangeText={(text: string) => setTextInput(text)}
          selectionColor={COLOR.MAIN_THEME_COLOR}
          placeholder={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
          keyboardType="default"
          autoFocus={true}
        />
      </View>
      <Button
        testID="btnLocationSubmit"
        title={strings('GENERICS.OK')}
        type={ButtonType.PRIMARY}
        style={styles.buttonWidth}
        onPress={() => props.onSubmit(textInput.toUpperCase())}
        disabled={textInput.length < 1}
      />
    </>
  );
};

export default EnterLocation;
