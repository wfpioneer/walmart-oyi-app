import React from 'react';
import { View } from 'react-native';
import Button from '../../../components/button/Button';
import COLOR from '../../../themes/Color';

export default class ButtonStyleGuide extends React.PureComponent {
  render(): React.ReactElement<any> {
    return (
      <View>
        <Button type={Button.Type.PRIMARY} title="Primary button type" />
        <Button type={Button.Type.NO_BORDER} title="No border button" titleColor={COLOR.MAIN_THEME_COLOR} />
        <Button type={Button.Type.SOLID_WHITE} title="Solid white button" titleColor={COLOR.MAIN_THEME_COLOR} />
        <Button type={Button.Type.PRIMARY} title="Disabled button" disabled />
      </View>
    );
  }
}
