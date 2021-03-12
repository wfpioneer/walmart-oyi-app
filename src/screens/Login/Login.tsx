import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Platform, View } from 'react-native';
// @ts-ignore
import WMSSO from 'react-native-wmsso';
import Config from 'react-native-config';
import Button from '../../components/buttons/Button';
import styles from './Login.style';
import { assignFluffyRoles, loginUser } from '../../state/actions/User';
import { getFluffyRoles } from '../../state/actions/saga';
import User from '../../models/User';
import { setLanguage, strings } from '../../locales';
import { hideActivityModal } from '../../state/actions/Modal';
import { setUserId, trackEvent } from '../../utils/AppCenterTool';
import { sessionEnd } from '../../utils/sessionTimeout';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { RootState } from '../../state/reducers/RootReducer';

const mapDispatchToProps = {
  loginUser,
  hideActivityModal,
  setEndTime,
  getFluffyRoles,
  assignFluffyRoles
};

const mapStateToProps = (state: RootState) => ({
  User: state.User,
  fluffyApiState: state.async.getFluffyRoles
});

export interface LoginScreenProps {
  loginUser: Function;
  User: User;
  navigation: Record<string, any>;
  hideActivityModal: Function;
  setEndTime: Function;
  getFluffyRoles: Function;
  fluffyApiState: any;
  assignFluffyRoles: Function;
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

  componentDidUpdate(prevProps: Readonly<LoginScreenProps>) {
    if (prevProps.fluffyApiState.isWaiting && this.props.fluffyApiState.error) {
      trackEvent('fluffy_api_error', {
        errorDetails: this.props.fluffyApiState.error.message || JSON.stringify(this.props.fluffyApiState.error)
      });
    }

    if (prevProps.fluffyApiState.isWaiting && this.props.fluffyApiState.result) {
      trackEvent('fluffy_api_success', {
        status: this.props.fluffyApiState.result.status
      });
      this.props.assignFluffyRoles(this.props.fluffyApiState.result);
      this.props.hideActivityModal();
      trackEvent('user_sign_in');
      this.props.navigation.replace('Tabs');
      this.props.setEndTime(sessionEnd());
    }
  }

  componentWillUnmount(): void {
    return this.unsubscribe && this.unsubscribe();
  }

  signInUser(): void {
    if (Config.ENVIRONMENT !== 'prod') {
      WMSSO.setEnv('STG');
    }
    WMSSO.getUser().then((user: User) => {
      if (!this.props.User.userId) {
        const countryCode = user.countryCode.toLowerCase();
        switch (countryCode) {
          case 'us':
            setLanguage('en');
            break;
          case 'cn':
            setLanguage('zh');
            break;
          case 'mx':
            setLanguage('es');
            break;
          default:
            setLanguage('en');
            break;
        }
      }
      user.userId = user.userId.replace('_', ''); // Strip underscore from svc accounts to prevent 400 error.
      setUserId(user.userId);
      this.props.loginUser(user);
      this.props.getFluffyRoles(user);
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
