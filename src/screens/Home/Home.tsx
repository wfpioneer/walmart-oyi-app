import React from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator, EmitterSubscription,
  SafeAreaView, ScrollView, Text, TouchableOpacity, View
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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

const mapStateToProps = (state: any) => ({
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

interface HomeScreenProps {
  userName: string;
  setScannedEvent: Function;
  setManualScan: Function;
  isManualScanEnabled: boolean;
  worklistSummaryApiState: any;
  getWorklistSummary: Function;
  navigation: StackNavigationProp<any>;
  updateFilterExceptions: Function;
}

interface HomeScreenState {
  activeGoal: number;
}

export class HomeScreen extends React.PureComponent<HomeScreenProps, HomeScreenState> {
  private readonly scannedSubscription: EmitterSubscription;

  private readonly navigationRemoveListener: Function;

  constructor(props: HomeScreenProps) {
    super(props);

    this.state = { activeGoal: 0 };

    // addListener returns a function to remove listener
    this.navigationRemoveListener = this.props.navigation.addListener('focus', () => {
      trackEvent('home_screen_focus');
      this.props.getWorklistSummary();
    });

    this.scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (props.navigation.isFocused()) {
        validateSession(props.navigation).then(() => {
          trackEvent('home_barcode_scanned', { barcode: scan.value, type: scan.type });
          props.setScannedEvent(scan);
          props.setManualScan(false);
          props.navigation.navigate('ReviewItemDetails');
        }).catch(() => {});
      }
    });
  }

  componentDidUpdate(prevProps: Readonly<HomeScreenProps>, prevState: Readonly<HomeScreenState>, snapshot?: any) {
    if (prevProps.worklistSummaryApiState.isWaiting && this.props.worklistSummaryApiState.error) {
      trackEvent('home_worklist_summary_api_error');
    }

    if (prevProps.worklistSummaryApiState.isWaiting && this.props.worklistSummaryApiState.result) {
      trackEvent('home_worklist_summary_api_success');
    }
  }

  componentWillUnmount() {
    if (this.scannedSubscription) this.scannedSubscription.remove();
    this.navigationRemoveListener();
  }

  render():
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number
    | {}
    | React.ReactNodeArray
    | React.ReactPortal
    | boolean
    | null
    | undefined {
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
          validateSession(this.props.navigation);
          this.props.navigation.navigate(strings('WORKLIST.WORKLIST'));
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
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
