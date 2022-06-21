import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator, EmitterSubscription, SafeAreaView, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsyncState } from '../../models/AsyncState';
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
import { exceptionTypeToDisplayString } from '../Worklist/FullExceptionList';
import { WorklistSummary } from '../../models/WorklistSummary';
import { CustomModalComponent } from '../Modal/Modal';
import { getBuildEnvironment } from '../../utils/environment';
import { mockMissingPalletWorklistSummary } from '../../mockData/mockWorklistSummary';

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
  getWorklistSummary: () => void;
  navigation: StackNavigationProp<any>;
  updateFilterExceptions: (worklistTypes: string[]) => void;
  route: RouteProp<any, string>;
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
            props.navigation.navigate('ReviewItemDetails');
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

    let { data }: { data: WorklistSummary[] } = this.props.worklistSummaryApiState.result;

    // Mock data for missing pallet worklist
    // TODO: Needs to be removed once the backend changes completed
    data = data.concat(mockMissingPalletWorklistSummary);

    const onGoalTitlePress = (index : number) => {
      this.setState({
        activeGoal: index
      });
    };

    const renderGoalCircles = () => data.map((goal, index) => {
      const frequency = goal.worklistGoal === 'DAILY' ? strings('GENERICS.DAILY') : '';
      const key = `${goal.worklistGoal}-${index}`;

      return (
        <GoalCircle
          key={key}
          goalTitle={index === 0 ? strings('HOME.ITEMS') : strings('LOCATION.PALLETS')}
          completionGoal={goal.worklistEndGoalPct}
          completionPercentage={goal.worklistGoalPct}
          active={index === this.state.activeGoal}
          frequency={frequency}
          onPress={() => onGoalTitlePress(index)}
        />
      );
    });

    const dataSummary = data[this.state.activeGoal];
    const renderWorklistCards = () => dataSummary.worklistTypes
      .map(worklist => {
        const worklistType = exceptionTypeToDisplayString(worklist?.worklistType.toUpperCase() ?? '');

        // TODO: Needs to navigate to new Missing worklist Landing page if worklistType is MP
        const onWorklistCardPress = () => {
          trackEvent('home_worklist_summary_card_press', { worklistCard: worklist.worklistType });
          this.props.updateFilterExceptions([worklist.worklistType]);
          validateSession(this.props.navigation, this.props.route.name).then(() => {
            this.props.navigation.navigate('WorklistHome', { screen: 'ItemWorklist' });
          }).catch(() => {});
        };

        const calculationValue = (worklist.completedItems / worklist.totalItems) * 100;
        const completionPercentageValue = Number.isFinite(calculationValue) ? calculationValue : 0;
        return (
          <WorklistCard
            key={worklist.worklistType}
            goalTitle={worklistType}
            goal={worklist.totalItems}
            complete={worklist.completedItems}
            completionPercentage={completionPercentageValue}
            completionGoal={dataSummary.worklistEndGoalPct}
            onPress={onWorklistCardPress}
          />
        );
      });

    return (
      <SafeAreaView style={styles.safeAreaView}>
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
