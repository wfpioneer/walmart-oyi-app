import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator, EmitterSubscription,
  Modal,
  SafeAreaView, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../../state/reducers/RootReducer';
import styles from './Home.style';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import WorklistCard from '../../components/worklistcard/WorklistCard';
import GoalCircle from '../../components/goalcircle/GoalCircle';
import { strings } from '../../locales';
import { getWorklistSummary } from '../../state/actions/saga';
import COLOR from '../../themes/Color';
import { updateFilterExceptions } from '../../state/actions/Worklist';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';
import Button from '../../components/buttons/Button';

const mapStateToProps = (state: RootState) => ({
  userName: state.User.additional.displayName,
  isManualScanEnabled: state.Global.isManualScanEnabled,
  worklistSummaryApiState: state.async.getWorklistSummary
});

const mapDispatchToProps = {
  setScannedEvent,
  setManualScan,
  getWorklistSummary,
  updateFilterExceptions
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');

interface HomeScreenProps {
  userName: string;
  setScannedEvent: (scan: any) => void;
  setManualScan: (isManualScan: boolean) => void;
  isManualScanEnabled: boolean;
  worklistSummaryApiState: AsyncState;
  getWorklistSummary: (payload?: any) => void;
  navigation: StackNavigationProp<any>;
  updateFilterExceptions: (worklistTypes: string[]) => void;
  route: RouteProp<any, string>;
}

interface HomeScreenState {
  activeGoal: number;
  getWorklistStart: number;
  errorModalVisible: boolean;
}

export class HomeScreen extends React.PureComponent<HomeScreenProps, HomeScreenState> {
  private readonly scannedSubscription: EmitterSubscription;

  private readonly navigationRemoveListener: () => void;

  constructor(props: HomeScreenProps) {
    super(props);

    this.state = { activeGoal: 0, getWorklistStart: 0, errorModalVisible: false };

    // addListener returns a function to remove listener
    this.navigationRemoveListener = this.props.navigation.addListener('focus', () => {
      trackEvent('home_screen_focus');
      this.setState({
        getWorklistStart: moment().valueOf()
      });
      trackEvent('home_worklist_summary_api_call');
      this.props.getWorklistSummary();
      this.setState({
        getWorklistStart: moment().valueOf()
      });
    });

    this.scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (props.navigation.isFocused()) {
        validateSession(props.navigation, props.route.name).then(() => {
          trackEvent('home_barcode_scanned', { barcode: scan.value, type: scan.type });
          if (!(scan.type.includes('QR Code') || scan.type.includes('QRCODE'))) {
            props.setScannedEvent(scan);
            props.setManualScan(false);
            props.navigation.navigate('ReviewItemDetails');
          } else {
            this.setState({ errorModalVisible: true });
          }
        }).catch(() => {});
      }
    });
  }

  // removed prevState and snapshot from componentDidUpdate, as it appears to be unused.
  // original line read: prevState: Readonly<HomeScreenState>, snapshot?: any
  componentDidUpdate(prevProps: Readonly<HomeScreenProps>): void {
    if (prevProps.worklistSummaryApiState.isWaiting && this.props.worklistSummaryApiState.error) {
      trackEvent('home_worklist_summary_api_failure', {
        errorDetails: this.props.worklistSummaryApiState.error.message
          || JSON.stringify(this.props.worklistSummaryApiState.error),
        duration: moment().valueOf() - this.state.getWorklistStart
      });
    }

    if (prevProps.worklistSummaryApiState.isWaiting && this.props.worklistSummaryApiState.result) {
      trackEvent('home_worklist_summary_api_success', {
        status: this.props.worklistSummaryApiState.result.status,
        duration: moment().valueOf() - this.state.getWorklistStart
      });
    }
  }

  componentWillUnmount(): void {
    if (this.scannedSubscription) this.scannedSubscription.remove();
    this.navigationRemoveListener();
  }

  render(): ReactNode {
    if (this.props.worklistSummaryApiState.isWaiting) {
      return (
        <View style={[styles.container, styles.safeAreaView]}>
          <ActivityIndicator color={COLOR.MAIN_THEME_COLOR} size={50} />
        </View>
      );
    }

    if (this.props.worklistSummaryApiState.error) {
      return (
        <View style={[styles.container, styles.safeAreaView]}>
          <MaterialCommunityIcons name="alert" size={50} color={COLOR.RED_500} />
          <Text style={styles.errorText}>{strings('HOME.WORKLIST_API_ERROR')}</Text>
          <TouchableOpacity
            style={styles.errorRetryButton}
            onPress={() => {
              trackEvent('home_worklist_summary_retry_button_click');
              trackEvent('home_worklist_summary_api_call');
              this.props.getWorklistSummary();
            }}
          >
            <Text>{strings('GENERICS.RETRY')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!this.props.worklistSummaryApiState.result || this.props.worklistSummaryApiState.result.status === 204) {
      return null;
    }

    const { data } = this.props.worklistSummaryApiState.result;

    const renderGoalCircles = () => data.map((goal: any, index: number) => {
      const frequency = goal.worklistGoal === 'DAILY' ? strings('GENERICS.DAILY') : '';

      return (
        <GoalCircle
          key={goal.worklistGoal}
          goalTitle={strings('HOME.ITEMS')}
          completionPercentage={goal.worklistGoalPct}
          active={index === this.state.activeGoal}
          frequency={frequency}
        />
      );
    });

    const renderWorklistCards = () => data[this.state.activeGoal].worklistTypes
      .map((worklist: { worklistType: string; completedItems: number; totalItems: number }) => {
        let worklistType: string;
        switch (worklist.worklistType ? worklist.worklistType.toUpperCase() : '') {
          case 'NSFL':
            worklistType = strings('EXCEPTION.NSFL');
            break;
          case 'PO':
            worklistType = strings('EXCEPTION.PRICE_OVERRIDE');
            break;
          case 'NP':
            worklistType = strings('EXCEPTION.NIL_PICK');
            break;
          case 'NS':
            worklistType = strings('EXCEPTION.NO_SALES');
            break;
          case 'NO':
            worklistType = strings('EXCEPTION.NEGATIVE_ON_HANDS');
            break;
          case 'C':
            worklistType = strings('EXCEPTION.CANCELLED');
            break;
          default:
            worklistType = strings('EXCEPTION.UNKNOWN');
        }

        const onWorklistCardPress = () => {
          trackEvent('home_worklist_summary_card_press', { worklistCard: worklist.worklistType });
          this.props.updateFilterExceptions([worklist.worklistType]);
          validateSession(this.props.navigation, this.props.route.name).then(() => {
            this.props.navigation.navigate(strings('WORKLIST.WORKLIST'));
          }).catch(() => {});
        };

        return (
          <WorklistCard
            key={worklist.worklistType}
            goalTitle={worklistType}
            goal={worklist.totalItems}
            complete={worklist.completedItems}
            completionPercentage={(worklist.completedItems / worklist.totalItems) * 100}
            completionGoal={data[this.state.activeGoal].worklistGoalPct}
            onPress={onWorklistCardPress}
          />
        );
      });

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Modal
          visible={this.state.errorModalVisible}
          transparent
        >
          <View style={styles.modalContainer}>
            <View style={styles.barcodeErrorContainer}>
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
            </View>
          </View>
        </Modal>
        {this.props.isManualScanEnabled && <ManualScanComponent />}
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
          { `${strings('GENERICS.VERSION')} ${pkg.version}` }
        </Text>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
