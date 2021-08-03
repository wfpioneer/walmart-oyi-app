import React, { RefObject, useRef, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import { modalStyles } from '../common/common.style';

interface EnterClubNbrFormProps {
  setClubNbr: (clubNbr: string) => void,
  onSubmit: (input: string) => void
}

const EnterClubNbrForm = (props: EnterClubNbrFormProps) => {
  const [textInput, setTextInput] = useState('');

  const textInputRef: RefObject<TextInput> = useRef(null);

  return (
    <View style={modalStyles.container}>
      <View style={modalStyles.contentContainer}>
        <TextInput
          ref={textInputRef}
          style={modalStyles.textInput}
          value={textInput}
          onChangeText={setTextInput}
          selectionColor={COLOR.MAIN_THEME_COLOR}
          placeholder={strings('LOGIN.CLUB_NBR_INPUT')}
          keyboardType="numeric"
          maxLength={5}
        />
      </View>
      <Button title={strings('GENERICS.OK')} onPress={() => props.onSubmit(textInput)} />
    </View>

  );
};
