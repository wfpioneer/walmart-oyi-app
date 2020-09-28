import React, { ReactNode } from 'react';
import AppCenter from 'appcenter';
import { connect } from 'react-redux';
import { Platform, View } from 'react-native';
// @ts-ignore
import WMSSO from 'react-native-wmsso';
import Button from '../../components/buttons/Button';
import styles from './Login.style';
import { loginUser } from '../../state/actions/User';
import User from '../../models/User';
import { strings } from '../../locales';
import { hideActivityModal } from '../../state/actions/Modal';
import { trackEvent } from '../../utils/AppCenterTool';

const mapDispatchToProps = {
  loginUser,
  hideActivityModal
};

interface LoginScreenProps {
  loginUser: Function;
  navigation: Record<string, any>;
  hideActivityModal: Function;
}

export class LoginScreen extends React.PureComponent<LoginScreenProps> {
  private unsubscribe: Function | undefined;

  constructor(props: any) {
    super(props);
    this.signInUser = this.signInUser.bind(this);
  }

  componentDidMount(): void {
    this.signInUser();
    // this following snippet is mostly for iOS, as
    // I need it to automatically call signInUser when we go back to the login screen
    if (Platform.OS === 'ios') {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.signInUser();
      });
    }
  }

  componentWillUnmount(): void {
    return this.unsubscribe && this.unsubscribe();
  }

  signInUser(): void {
    WMSSO.getUser().then((user: User) => {
      AppCenter.setUserId(user.userId);
      this.props.loginUser(user);
      this.props.hideActivityModal();
      trackEvent('user_sign_in', { username: user.userId });
      this.props.navigation.replace('Tabs');
    });
  }

  render(): ReactNode {
    return (
      <View style={styles.container}>
        <Button
          title={strings('GENERICS.SIGN_IN')}
          style={styles.signInButton}
          onPress={this.signInUser}
        />
      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(LoginScreen);
