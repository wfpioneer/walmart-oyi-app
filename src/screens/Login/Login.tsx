import { NavigationProp } from '@react-navigation/native';
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  Modal, Platform, View
} from 'react-native';
// @ts-expect-error // react-native-wmsso has no type definition it would seem
import WMSSO from 'react-native-wmsso';
import Config from 'react-native-config';
import Button from '../../components/buttons/Button';
import EnterClubNbrForm from '../../components/EnterClubNbrForm/EnterClubNbrForm';
import styles from './Login.style';
import { assignFluffyFeatures, loginUser, logoutUser } from '../../state/actions/User';
import { getFluffyFeatures } from '../../state/actions/saga';
import User from '../../models/User';
import { setLanguage, strings } from '../../locales';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setUserId, trackEvent } from '../../utils/AppCenterTool';
import { sessionEnd } from '../../utils/sessionTimeout';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { RootState } from '../../state/reducers/RootReducer';

const mapDispatchToProps = {
  loginUser,
  logoutUser,
  hideActivityModal,
  setEndTime,
  getFluffyFeatures,
  assignFluffyFeatures,
  showActivityModal
};

const mapStateToProps = (state: RootState) => ({
  User: state.User,
  fluffyApiState: state.async.getFluffyRoles
});

// TODO correct all the function definitions (specifically return types)
export interface LoginScreenProps {
  loginUser: (userPayload: User) => void;
  logoutUser: () => void,
  User: User;
  navigation: NavigationProp<any>;
  hideActivityModal: () => void;
  setEndTime: (sessionEndTime: any) => void;
  getFluffyFeatures: (payload: any) => void;
  fluffyApiState: any;
  assignFluffyFeatures: (resultPayload: string[]) => void;
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
        this.props.assignFluffyFeatures(this.props.fluffyApiState.result.data);
      } else if (this.props.fluffyApiState.error) {
        // TODO Display toast/popup letting user know roles could not be retrieved
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

  signOutUser(): void {
    this.props.showActivityModal();
    trackEvent('user_sign_out', { lastPage: 'Login' });
    WMSSO.signOutUser().then(() => {
      this.props.logoutUser();
      if (Platform.OS === 'android') {
        this.props.hideActivityModal();
      }
      this.signInUser();
    });
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
      if (this.props.User.siteId) {
        this.props.getFluffyFeatures(user);
      }
    });
  }

  render(): ReactNode {
    return (
      <View style={styles.container}>
        <Modal
          visible={this.props.User.siteId === undefined}
          transparent
        >
          <EnterClubNbrForm
            onSubmit={clubNbr => {
              const updatedUser = { ...this.props.User, siteId: clubNbr };
              this.props.loginUser(updatedUser);
              trackEvent('user_sign_in');
              this.props.getFluffyFeatures(updatedUser);
            }}
            onSignOut={() => this.signOutUser()}
          />
        </Modal>
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
