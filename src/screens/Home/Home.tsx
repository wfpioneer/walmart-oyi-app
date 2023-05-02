import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator, EmitterSubscription, SafeAreaView, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsyncState } from '../../models/AsyncState';
import { Configurations } from '../../models/User';
import { RootState } from '../../state/reducers/RootReducer';
import styles from './Home.style';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import WorklistCard from '../../components/worklistcard/WorklistCard';
import GoalCircle from '../../components/goalcircle/GoalCircle';
import { strings } from '../../locales';
import { getWorklistSummary } from '../../state/actions/saga';
import { UserConfigResponse } from '../../services/UserConfig.service';
import COLOR from '../../themes/Color';
import { setWorklistType, updateFilterExceptions } from '../../state/actions/Worklist';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import Button, { ButtonType } from '../../components/buttons/Button';
import { exceptionTypeToDisplayString } from '../Worklist/FullExceptionList';
import { WorklistGoal, WorklistSummary } from '../../models/WorklistSummary';
import { CustomModalComponent } from '../Modal/Modal';
import { getBuildEnvironment } from '../../utils/environment';
import { UPDATE_USER_CONFIG } from '../../state/actions/asyncAPI';

export const resetUserConfigUpdateApiState = () => ({ type: UPDATE_USER_CONFIG.RESET });
const mapStateToProps = (state: RootState) => ({
  userName: state.User.additional.displayName,
  userConfig: state.User.configs,
  isManualScanEnabled: state.Global.isManualScanEnabled,
  worklistSummaryApiState: state.async.getWorklistSummary,
  userConfigUpdateApiState: state.async.updateUserConfig,
  userFeatures: state.User.features
});

const mapDispatchToProps = {
  setScannedEvent,
  setManualScan,
  getWorklistSummary,
  updateFilterExceptions,
  setWorklistType,
  resetUserConfigUpdateApiState
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');

export interface HomeScreenProps {
  userName: string;
  setScannedEvent: (scan: any) => void;
  setManualScan: (isManualScan: boolean) => void;
  setWorklistType: (worklistType: string) => void;
  isManualScanEnabled: boolean;
  worklistSummaryApiState: AsyncState;
  userConfigUpdateApiState: AsyncState;
  getWorklistSummary: () => void;
  navigation: NavigationProp<any>;
  updateFilterExceptions: (worklistTypes: string[]) => void;
  route: RouteProp<any, string>;
  userConfig: Configurations;
  resetUserConfigUpdateApiState: () => void;
  userFeatures: string[];
}

interface HomeScreenState {
  activeGoal: number;
  errorModalVisible: boolean;
}

export class HomeScreen extends React.PureComponent<HomeScreenProps, HomeScreenState> {
  private readonly scannedSubscription: EmitterSubscription;

  private readonly navigationRemoveListener: () => void;

  constructor(props: HomeScreenProps) {
    super(props);

    this.state = { activeGoal: 0, errorModalVisible: false };

    // addListener returns a function to remove listener
    this.navigationRemoveListener = this.props.navigation.addListener('focus', () => {
      trackEvent('home_screen_focus');
      this.props.getWorklistSummary();
    });

    this.scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (props.navigation.isFocused()) {
        validateSession(props.navigation, props.route.name).then(() => {
          trackEvent('home_barcode_scanned', { barcode: scan.value, type: scan.type });
          if (!(scan.type.includes('QR Code') || scan.type.includes('QRCODE'))) {
            props.setScannedEvent(scan);
            props.setManualScan(false);
            props.navigation.navigate('ReviewItemDetails', { screen: 'ReviewItemDetailsHome' });
          } else {
            this.setState({ errorModalVisible: true });
          }
        }).catch(() => {});
      }
    });
  }

  componentWillUnmount(): void {
    if (this.scannedSubscription) { this.scannedSubscription.remove(); }
    this.navigationRemoveListener();
  }

  renderFeedbackModal = () => {
    const LoginDivisibleCountToShowFeedback = 10;
    let showFeedbackModal = false;
    if (!this.props.userConfigUpdateApiState.isWaiting
      && this.props.userConfigUpdateApiState.result
      && this.props.userConfigUpdateApiState.result.status === 200) {
      const userConfigRes: UserConfigResponse = this.props.userConfigUpdateApiState.result.data;
      showFeedbackModal = (userConfigRes.loginCount % LoginDivisibleCountToShowFeedback) === 0;

      if (showFeedbackModal) {
        return (
          <CustomModalComponent
            isVisible={true}
            onClose={() => {
              this.props.resetUserConfigUpdateApiState();
            }}
            modalType="Form"
          >
            <View style={styles.modalContainer}>
              <View>
                <Text style={styles.descriptionText}>
                  {strings('FEEDBACK.FEEDBACK_REQUEST')}
                </Text>
              </View>
              <View style={styles.actionRow}>
                <Button
                  testID="noButton"
                  title={strings('FEEDBACK.NO')}
                  onPress={() => {
                    this.props.resetUserConfigUpdateApiState();
                  }}
                  type={ButtonType.SOLID_WHITE}
                  titleColor={COLOR.MAIN_THEME_COLOR}
                  style={styles.button}
                />
                <Button
                  testID="yesButton"
                  title={strings('FEEDBACK.YES')}
                  onPress={() => {
                    this.props.resetUserConfigUpdateApiState();
                    this.props.navigation.navigate('FeedbackScreen');
                  }}
                  type={ButtonType.PRIMARY}
                  style={styles.button}
                />
              </View>
            </View>
          </CustomModalComponent>
        );
      }
      this.props.resetUserConfigUpdateApiState();
    }
    if (!this.props.userConfigUpdateApiState.isWaiting
        && this.props.userConfigUpdateApiState.error) {
      this.props.resetUserConfigUpdateApiState();
    }
    return null;
  };

  render(): ReactNode {
    if (this.props.worklistSummaryApiState.isWaiting) {
      return (
        <View style={[styles.container, styles.safeAreaView]}>
          <ActivityIndicator color={COLOR.MAIN_THEME_COLOR} size={50} />
        </View>
      );
    }

    if (this.props.worklistSummaryApiState.error
      || (this.props.worklistSummaryApiState.result && this.props.worklistSummaryApiState.result.status === 204)) {
      return (
        <View style={styles.safeAreaView}>
          {this.props.isManualScanEnabled
          && <ManualScanComponent placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />}
          <View style={[styles.container, styles.safeAreaView]}>
            <MaterialCommunityIcons name="alert" size={50} color={COLOR.RED_500} />
            <Text style={styles.errorText}>{strings('HOME.WORKLIST_API_ERROR')}</Text>
            <TouchableOpacity
              style={styles.errorRetryButton}
              onPress={() => {
                trackEvent('home_worklist_summary_retry_button_click');
                this.props.getWorklistSummary();
              }}
            >
              <Text>{strings('GENERICS.RETRY')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (!this.props.worklistSummaryApiState.result || this.props.worklistSummaryApiState.result.status === 204) {
      return null;
    }

    const { data }: { data: WorklistSummary[] } = this.props.worklistSummaryApiState.result;

    const onGoalTitlePress = (index : number) => {
      this.setState({
        activeGoal: index
      });
    };

    const getWorklistGoalTitle = (worklistGoal: WorklistGoal) => {
      switch (worklistGoal) {
        case WorklistGoal.ITEMS:
          return strings('HOME.ITEMS');
        case WorklistGoal.PALLETS:
          return strings('LOCATION.PALLETS');
        case WorklistGoal.AUDITS:
          return strings('EXCEPTION.AUDITS');
        default:
          return '';
      }
    };

    const renderGoalCircles = () => data.map((goal, index) => {
      const goalTitle = getWorklistGoalTitle(goal.worklistGoal);
      const palletWorklistsEnabled = this.props.userConfig.palletWorklists;
      const auditsWorklistsEnabled = this.props.userConfig.auditWorklists
        && this.props.userFeatures.includes('on hands change');

      // Disabled pallet worklist Goal Circle based on feature flag
      if (!palletWorklistsEnabled && goal.worklistGoal === WorklistGoal.PALLETS) {
        return null;
      }

      // Disabled audits worklist Goal Circle based on feature flag
      if (!auditsWorklistsEnabled && goal.worklistGoal === WorklistGoal.AUDITS) {
        return null;
      }

      return (
        <GoalCircle
          key={goal.worklistGoal}
          goalTitle={goalTitle}
          completionGoal={goal.worklistEndGoalPct}
          completionPercentage={goal.worklistGoalPct}
          active={index === this.state.activeGoal}
          onPress={() => onGoalTitlePress(index)}
        />
      );
    });

    const dataSummary = data[this.state.activeGoal];
    const isRollOverComplete = () => {
      const rollOverSummary = dataSummary.worklistTypes.find(wlType => wlType.worklistType === 'RA');
      if (rollOverSummary) {
        return rollOverSummary.totalItems === 0 || rollOverSummary.completedItems === rollOverSummary.totalItems;
      }
      return true;
    };

    const renderWorklistCards = () => dataSummary.worklistTypes
      .map(worklist => {
        const rollOverAuditWLEnabled = this.props.userConfig.showRollOverAudit;
        const inProgressEnabled = this.props.userConfig.inProgress;
        // when show roll over complete is enabled than show only roll over when it is not completed
        // and do not show the audit worklist type
        // if completed or no roll over than show both audit worklist
        if (worklist.worklistType === 'AU' && rollOverAuditWLEnabled && !isRollOverComplete()) {
          return null;
        }

        if (worklist.worklistType === 'NO' && !this.props.userFeatures.includes('on hands change')) {
          return null;
        }
        const worklistType = worklist.worklistType === 'MP'
          ? strings('EXCEPTION.MISSING_PALLETS')
          : exceptionTypeToDisplayString(worklist?.worklistType.toUpperCase() ?? '');
        const isPalletWorklist = dataSummary.worklistGoal === WorklistGoal.PALLETS;
        const isAuditWorklist = dataSummary.worklistGoal === WorklistGoal.AUDITS;

        const onWorklistCardPress = () => {
          trackEvent('home_worklist_summary_card_press', { worklistCard: worklist.worklistType });
          this.props.updateFilterExceptions([worklist.worklistType]);
          validateSession(this.props.navigation, this.props.route.name).then(() => {
            if (isPalletWorklist) {
              this.props.navigation.navigate(
                strings('WORKLIST.WORKLIST'),
                { screen: 'MissingPalletWorklist', initial: false }
              );
            } else if (isAuditWorklist) {
              this.props.setWorklistType('AUDIT');
              this.props.navigation.navigate(
                strings('WORKLIST.WORKLIST'),
                { screen: 'AuditWorklistNavigator', initial: false }
              );
            } else {
              const { auditWorklists, palletWorklists } = this.props.userConfig;
              this.props.setWorklistType('ITEM');
              if (auditWorklists || palletWorklists) {
                this.props.navigation.navigate(
                  strings('WORKLIST.WORKLIST'),
                  { screen: 'WorklistNavigator', initial: false }
                );
              } else {
                this.props.navigation.navigate('WorklistNavigator', { screen: 'ITEMWORKLIST' });
              }
            }
          }).catch(() => {});
        };

        const calculationValue = (worklist.completedItems / worklist.totalItems) * 100;
        const completionPercentageValue = Number.isFinite(calculationValue) ? calculationValue : 0;

        const pendingCalcValue = ((worklist.completedItems + worklist.inProgressItems) / worklist.totalItems) * 100;
        const pendingPercentageValue = Number.isFinite(pendingCalcValue) ? pendingCalcValue : 0;

        return (
          <WorklistCard
            key={worklist.worklistType}
            goalTitle={worklistType}
            goal={worklist.totalItems}
            complete={worklist.completedItems}
            completionPercentage={completionPercentageValue}
            completionGoal={dataSummary.worklistEndGoalPct}
            onPress={onWorklistCardPress}
            pendingPercentage={pendingPercentageValue}
            inProgress={inProgressEnabled}
          />
        );
      });

    return (
      <SafeAreaView style={styles.safeAreaView}>
        {this.props.userConfig.showFeedback && this.renderFeedbackModal()}
        <CustomModalComponent
          isVisible={this.state.errorModalVisible}
          onClose={() => this.setState({ errorModalVisible: false })}
          modalType="Error"
        >
          <MaterialCommunityIcons name="alert" size={30} color={COLOR.RED_500} style={styles.iconPosition} />
          <Text style={styles.barcodeErrorText}>
            {strings('GENERICS.BARCODE_SCAN_ERROR')}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.dismissButton}
              title={strings('GENERICS.OK')}
              backgroundColor={COLOR.TRACKER_RED}
              onPress={() => this.setState({ errorModalVisible: false })}
            />
          </View>
        </CustomModalComponent>
        {this.props.isManualScanEnabled && <ManualScanComponent placeholder={strings('GENERICS.ENTER_UPC_ITEM_NBR')} />}
        <ScrollView contentContainerStyle={styles.container}>
          <Text>
            { `${strings('HOME.WELCOME')} ${this.props.userName}` }
          </Text>
          <View style={styles.horizontalContainer}>
            { renderGoalCircles() }
          </View>
          { renderWorklistCards() }
        </ScrollView>
        <Text style={styles.versionDisplay}>
          { `${strings('GENERICS.VERSION')} ${pkg.version}${getBuildEnvironment()}` }
        </Text>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
