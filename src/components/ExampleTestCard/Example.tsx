import React from 'react';
import {
  Button, Text, TextInput, View
} from 'react-native';

interface ExampleProps{
  userName: string;
}
export function Example(props: ExampleProps) {
  const [name, setUser] = React.useState('');
  const [show, setShow] = React.useState(false);

  return (
    <View>
      <TextInput value={props.userName} onChangeText={setUser} testID="input" />
      <Button
        title="Print Username"
        onPress={() => {
          // let's pretend this is making a server request, so it's async
          // (you'd want to mock this imaginary request in your unit tests)...
          setTimeout(() => {
            setShow(!show);
          }, Math.floor(Math.random() * 200));
        }}
      />
      {show && <Text testID="printed-username">{name}</Text>}
    </View>
  );
}
