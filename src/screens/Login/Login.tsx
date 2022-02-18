import { NavigationProp } from '@react-navigation/native';
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Platform, Text, View } from 'react-native';
// @ts-expect-error // react-native-wmsso has no type definition it would seem
import WMSSO from 'react-native-wmsso';
import Config from 'react-native-config';
import { Printer } from '../../models/Printer';
import Button from '../../components/buttons/Button';
import EnterClubNbrForm from '../../components/EnterClubNbrForm/EnterClubNbrForm';
import styles from './Login.style';
import {
  assignFluffyFeatures, loginUser, logoutUser, setConfigs
} from '../../state/actions/User';
import { getClubConfig, getFluffyFeatures } from '../../state/actions/saga';
import User from '../../models/User';
import { setLanguage, strings } from '../../locales';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setUserId, trackEvent } from '../../utils/AppCenterTool';
import { sessionEnd } from '../../utils/sessionTimeout';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { RootState } from '../../state/reducers/RootReducer';
import { CustomModalComponent, ModalCloseIcon } from '../Modal/Modal';
import { getBuildEnvironment } from '../../utils/environment';
import COLOR from '../../themes/Color';
import IconButton from '../../components/buttons/IconButton';
import { AsyncState } from '../../models/AsyncState';
import { ConfigResponse } from '../../services/Config.service';
import {
  getLocationLabelPrinter,
  getPalletLabelPrinter,
  getPriceLabelPrinter,
  getPrinterList
} from '../../utils/asyncStorageUtils';
import {
  setLocationLabelPrinter,
  setPalletLabelPrinter,
  setPriceLabelPrinter,
  setPrinterList
} from '../../state/actions/Print';

const mapDispatchToProps = {
  loginUser,
  logoutUser,
  hideActivityModal,
  setEndTime,
  getFluffyFeatures,
  assignFluffyFeatures,
  getClubConfig,
  setConfigs,
  showActivityModal,
  setLocationLabelPrinter,
  setPalletLabelPrinter,
  setPriceLabelPrinter,
  setPrinterList
};

// This type uses all fields from the User type except it makes siteId optional
// It is necessary to provide an accurate type to the User object returned
// from WMSSO.getUser (since its siteId is optional and CN users can log in without one)
type WMSSOUser = Pick<Partial<User>, 'siteId'> & Omit<User, 'siteId'>;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');

const mapStateToProps = (state: RootState) => ({
  User: state.User,
  fluffyApiState: state.async.getFluffyRoles,
  getClubConfigApiState: state.async.getClubConfig
});

// Since CN Associate JobCodes are inconsistent, this set of roles will be added
// to all successful fluffy responses for CN
// If we encounter future scenarios, we can modify this set of Associate roles
// NOTE: This is only a stop-gap until a better solution is found
const CN_ASSOCIATE_ROLES = ['on hands change'];

// This method merges our hard-coded Associate roles with our fluffy response
const addCNAssociateRoleOverrides = (
  fluffyRoles: string[]
): string[] => Array.from(new Set([...fluffyRoles, ...CN_ASSOCIATE_ROLES]));

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
  getClubConfig: () => void;
  getClubConfigApiState: AsyncState;
  setConfigs: (configs: ConfigResponse) => void;
  showActivityModal: () => void;
  setPrinterList: (payload: Printer[]) => void;
  setPriceLabelPrinter: (payload: Printer | null) => void;
  setLocationLabelPrinter: (payload: Printer | null) => void;
  setPalletLabelPrinter: (payload: Printer | null) => void;
}

const userIsSignedIn = (user: User): boolean => user.userId !== '' && user.token !== '';
const SelectCountryCodeModal = (props: {onSignOut: () => void, onSubmitMX:() => void, onSubmitCN: () => void}) => {
  const { onSignOut, onSubmitCN, onSubmitMX } = props;
  return (
    <>
      <View style={styles.closeContainer}>
        <IconButton
          icon={ModalCloseIcon}
          type={Button.Type.NO_BORDER}
          onPress={() => onSignOut()}
          style={styles.closeButton}
        />
      </View>
      <Text style={styles.titleText}>
        Please select a country to sign into
      </Text>
      <View style={styles.buttonRow}>
        <Button
          title="MX"
          onPress={() => onSubmitMX()}
          type={Button.Type.SOLID_WHITE}
          titleColor={COLOR.MAIN_THEME_COLOR}
          style={styles.affirmButton}
        />
        <Button
          title="CN"
          onPress={() => onSubmitCN()}
          type={Button.Type.PRIMARY}
          style={styles.affirmButton}
        />
      </View>
    </>
  );
};

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
    if (this.props.fluffyApiState.isWaiting || this.props.getClubConfigApiState.isWaiting) {
      this.props.showActivityModal();
    }

    if (prevProps.fluffyApiState.isWaiting) {
      if (this.props.fluffyApiState.result) {
        const userCountryCode = this.props.User.countryCode.toUpperCase();
        const fluffyResultData = this.props.fluffyApiState.result.data;
        const fluffyFeatures = userCountryCode === 'CN' ? addCNAssociateRoleOverrides(fluffyResultData)
          : fluffyResultData;
        this.props.assignFluffyFeatures(fluffyFeatures);
      } else if (this.props.fluffyApiState.error) {
        // TODO Display toast/popup letting user know roles could not be retrieved
      }

      this.props.getClubConfig();
    }

    if (prevProps.getClubConfigApiState.isWaiting) {
      if (this.props.getClubConfigApiState.result) {
        this.props.setConfigs(this.props.getClubConfigApiState.result.data);
        if (this.props.getClubConfigApiState.result.data.printingUpdate) {
          this.getPrinterDetailsFromAsyncStorage();
        }
      } else if (this.props.getClubConfigApiState.error) {
        // TODO Display toast/popup for error
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

  async getPrinterDetailsFromAsyncStorage(): Promise<void> {
    const printerList = await getPrinterList();
    const priceLabelPrinter = await getPriceLabelPrinter();
    const palletLabelPrinter = await getPalletLabelPrinter();
    const locationLabelPrinter = await getLocationLabelPrinter();
    if (printerList && printerList.length > 0) {
      this.props.setPrinterList(printerList);
    }
    this.props.setPriceLabelPrinter(priceLabelPrinter);
    this.props.setPalletLabelPrinter(palletLabelPrinter);
    this.props.setLocationLabelPrinter(locationLabelPrinter);
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
    WMSSO.getUser().then((user: WMSSOUser) => {
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
      this.props.loginUser({ ...user, siteId: user.siteId ?? 0 });
      trackEvent('user_sign_in');
      if (user.siteId && user.countryCode !== 'US') {
        this.props.getFluffyFeatures(user);
      }
    });
  }

  render(): ReactNode {
    return (
      <View style={styles.container}>
        <CustomModalComponent
          isVisible={!this.props.User.siteId && userIsSignedIn(this.props.User)}
          onClose={() => this.signOutUser()}
          modalType="Form"
        >
          <EnterClubNbrForm
            onSubmit={clubNbr => {
              const updatedUser = { ...this.props.User, siteId: clubNbr };
              this.props.loginUser(updatedUser);
              trackEvent('user_sign_in');
              if (this.props.User.countryCode !== 'US') {
                this.props.getFluffyFeatures(updatedUser);
              }
            }}
            onSignOut={() => this.signOutUser()}
          />
        </CustomModalComponent>
        <CustomModalComponent
          isVisible={
            this.props.User.siteId !== 0
            && this.props.User.countryCode === 'US'
            && userIsSignedIn(this.props.User)
          }
          onClose={() => this.signOutUser()}
          modalType="Form"
        >
          <SelectCountryCodeModal
            onSignOut={() => this.signOutUser()}
            onSubmitCN={() => {
              const updatedUser = { ...this.props.User, countryCode: 'CN' };
              this.props.loginUser(updatedUser);
              this.props.getFluffyFeatures(updatedUser);
            }}
            onSubmitMX={() => {
              const updatedUser = { ...this.props.User, countryCode: 'MX' };
              this.props.loginUser(updatedUser);
              this.props.getFluffyFeatures(updatedUser);
            }}
          />
        </CustomModalComponent>
        <View style={styles.buttonContainer}>
          <Button
            title={strings('GENERICS.SIGN_IN')}
            style={styles.signInButton}
            onPress={this.signInUser}
          />
        </View>
        <Text style={styles.versionDisplay}>
          { `${strings('GENERICS.VERSION')} ${pkg.version}${getBuildEnvironment()}` }
        </Text>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
