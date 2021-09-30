import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import { modalStyles } from './EnterClubNbrForm.style';

const nonNumberRegex = /[^0-9]/;

interface EnterClubNbrFormProps {
  onSignOut: () => void,
  onSubmit: (input: number) => void
}

const validate = (inputText: string): boolean => {
  if (inputText.trim().length === 0) {
    return false;
  }

  const parsedClubNbr = parseInt(inputText.trim(), 10);
  return parsedClubNbr > 0 && parsedClubNbr <= 99999;
};

const EnterClubNbrForm = (props: EnterClubNbrFormProps): JSX.Element => {
  const [textInput, setTextInput] = useState('');
  const { onSubmit, onSignOut } = props;
  const inputIsValid = validate(textInput);

  return (
    <>
      <Text style={modalStyles.titleText}>{strings('LOGIN.CLUB_NBR_REQUIRED')}</Text>
      <TextInput
        value={textInput}
        onChangeText={input => setTextInput(input.replace(nonNumberRegex, ''))}
        selectionColor={COLOR.MAIN_THEME_COLOR}
        placeholder={strings('LOGIN.ENTER_CLUB_NBR')}
        keyboardType="numeric"
        maxLength={5}
        textAlign="center"
      />
      <View style={modalStyles.buttonRow}>
        <Button
          title={strings('GENERICS.SIGN_OUT')}
          onPress={() => onSignOut()}
          type={Button.Type.SOLID_WHITE}
          titleColor={COLOR.MAIN_THEME_COLOR}
          style={modalStyles.cancelButton}
        />
        <Button
          title={strings('GENERICS.SUBMIT')}
          onPress={() => onSubmit(parseInt(textInput, 10))}
          disabled={!inputIsValid}
          type={Button.Type.PRIMARY}
          style={modalStyles.affirmButton}
        />
      </View>
    </>
  );
};

export default EnterClubNbrForm;
