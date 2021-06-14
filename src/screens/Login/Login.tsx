import { NavigationProp } from '@react-navigation/native';
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Platform, View } from 'react-native';
// @ts-ignore // 'react-native-wmsso' has no type definition it would seem
import WMSSO from 'react-native-wmsso';
import Config from 'react-native-config';
import Button from '../../components/buttons/Button';
import styles from './Login.style';
import { assignFluffyRoles, loginUser } from '../../state/actions/User';
import { getFluffyRoles } from '../../state/actions/saga';
import User from '../../models/User';
import { setLanguage, strings } from '../../locales';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setUserId, trackEvent } from '../../utils/AppCenterTool';
import { sessionEnd } from '../../utils/sessionTimeout';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { RootState } from '../../state/reducers/RootReducer';

const mapDispatchToProps = {
  loginUser,
  hideActivityModal,
  setEndTime,
  getFluffyRoles,
  assignFluffyRoles,
  showActivityModal
};

const mapStateToProps = (state: RootState) => ({
  User: state.User,
  fluffyApiState: state.async.getFluffyRoles
});

// TODO correct all the function definitions (specifically return types)
export interface LoginScreenProps {
  loginUser: (userPayload: User) => void;
  User: User;
  navigation: NavigationProp<any>;
  hideActivityModal: () => void;
  setEndTime: (sessionEndTime: any) => void;
  getFluffyRoles: (payload: any) => void;
  fluffyApiState: any;
  assignFluffyRoles: (resultPayload: string[]) => void;
  showActivityModal: () => void;
}

// TODO convert to Functional Component
export class LoginScreen extends React.PureComponent<LoginScreenProps> {
  private unsubscribe: (() => void | undefined) | undefined;

  constructor(props: LoginScreenProps) {
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

  componentDidUpdate(prevProps: Readonly<LoginScreenProps>): void {
    if (this.props.fluffyApiState.isWaiting) {
      this.props.showActivityModal();
    }

    if (prevProps.fluffyApiState.isWaiting) {
      if (this.props.fluffyApiState.result) {
        trackEvent('fluffy_api_success', {
          status: this.props.fluffyApiState.result.status
        });
        this.props.assignFluffyRoles(this.props.fluffyApiState.result.data);
      } else if (this.props.fluffyApiState.error) {
        // TODO Display toast/popup letting user know roles could not be retrieved
        trackEvent('fluffy_api_failure', {
          errorDetails: this.props.fluffyApiState.error.message || JSON.stringify(this.props.fluffyApiState.error)
        });
      }

      this.props.hideActivityModal();
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }]
      });
      this.props.setEndTime(sessionEnd());
    }
  }

  componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  signInUser(): void {
    if (Config.ENVIRONMENT !== 'prod') {
      // For use with Fluffy in non-prod
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
      setUserId(user.userId);
      this.props.loginUser(user);
      trackEvent('user_sign_in');
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
