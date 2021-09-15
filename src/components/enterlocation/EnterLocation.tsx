import React, { RefObject, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './EnterLocation.style';
import IconButton from '../buttons/IconButton';
import Button from '../buttons/Button';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';

const EnterLocation = (
  props:{ setEnterLocation: React.Dispatch<React.SetStateAction<boolean>>; onSubmit: (value: string) => void }
): JSX.Element => {
  const [textInput, setTextInput] = useState('');

  const textInputRef: RefObject<TextInput> = useRef(null);

  return (
    <>
      <View style={styles.closeContainer}>
        <IconButton
          icon={<MaterialCommunityIcon name="close" size={16} color={COLOR.GREY_500} />}
          type={Button.Type.NO_BORDER}
          onPress={() => props.setEnterLocation(false)}
        />
      </View>
      <View style={styles.scanContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          value={textInput}
          onChangeText={(text: string) => setTextInput(text)}
          selectionColor={COLOR.MAIN_THEME_COLOR}
          placeholder={strings('LOCATION.MANUAL_ENTRY_BUTTON')}
          keyboardType="default"
        />
      </View>
      <Button
        title={strings('GENERICS.OK')}
        type={Button.Type.PRIMARY}
        style={styles.buttonWidth}
        onPress={() => props.onSubmit(textInput.toUpperCase())}
        disabled={textInput.length < 1}
      />
    </>
  );
};

export default EnterLocation;
