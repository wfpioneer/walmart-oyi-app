import React from 'react';
import { StyleSheet, View } from 'react-native';
import TextInputComponent from '../../../components/textinput/TextInput';
import COLOR from '../../../themes/Color';

const styles = StyleSheet.create({
  defaultStyle: {
    flex: 1,
    marginTop: 10
  }
});

interface TextInputStyleGuideState {
  text: string;
  multiLineText: string;
}

export default class TextInputStyleGuide extends React.PureComponent<null, TextInputStyleGuideState> {
  constructor(props: any) {
    super(props);
    this.state = { text: '', multiLineText: '' };
  }

  render(): React.ReactElement<any> {
    return (
      <View>
        <TextInputComponent
          style={styles.defaultStyle}
          value={this.state.text}
          placeholder="Placeholder text"
          onChangeText={(value: string) => this.setState({ text: value })}
          label="Placeholder title"
          selectionColor={COLOR.BLACK}
        />
        <TextInputComponent
          style={styles.defaultStyle}
          value={this.state.multiLineText}
          multiline
          placeholder="Multiline text"
          onChangeText={(value: string) => this.setState({ multiLineText: value })}
          label="Multiline title"
          selectionColor={COLOR.BLACK}
        />
      </View>
    );
  }
}
