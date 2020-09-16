import React from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  EmitterSubscription, SafeAreaView, ScrollView, Text, TouchableOpacity, View
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

const mapStateToProps = (state: any) => ({
  userName: state.User.additional.displayName,
  isManualScanEnabled: state.Global.isManualScanEnabled,
  worklistSummaryApiState: state.async.getWorklistSummary
});

const mapDispatchToProps = {
  setScannedEvent,
  setManualScan,
  getWorklistSummary
};

interface HomeScreenProps {
  userName: string;
  setScannedEvent: Function;
  setManualScan: Function;
  isManualScanEnabled: boolean;
  worklistSummaryApiState: any;
  getWorklistSummary: Function;
  navigation: StackNavigationProp<any>;
}

interface HomeScreenState {
  activeGoal: number;
}

export class HomeScreen extends React.PureComponent<HomeScreenProps, HomeScreenState> {
  private readonly scannedSubscription: EmitterSubscription;

  constructor(props: HomeScreenProps) {
    super(props);

    this.state = { activeGoal: 0 };

    this.scannedSubscription = barcodeEmitter.addListener('scanned', scan => {
      if (props.navigation.isFocused()) {
        props.setScannedEvent(scan);
        props.setManualScan(false);
        props.navigation.navigate('ReviewItemDetails');
      }
    });
  }

  componentDidMount() {
    this.props.getWorklistSummary();
  }

  componentWillUnmount() {
    if (this.scannedSubscription) this.scannedSubscription.remove();
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
          <TouchableOpacity style={styles.errorRetryButton}>
            <Text>{strings('GENERICS.RETRY')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!this.props.worklistSummaryApiState.result || this.props.worklistSummaryApiState.result.status === 204) {
      return null;
    }

    const { data } = this.props.worklistSummaryApiState.result;

    const renderGoalCircles = () => data.map((goal: any, index: number) => (
      <GoalCircle
        key={goal.worklistGoal}
        goalTitle={strings('HOME.ITEMS')}
        completionPercentage={goal.worklistGoalPct}
        active={index === this.state.activeGoal}
        frequency={goal.worklistGoal}
      />
    ));

    const renderWorklistCards = () => data[this.state.activeGoal].worklistTypes
      .map((worklist: { worklistType: string; completedItems: number; totalItems: number }) => {
        let worklistType: string;
        switch (worklist.worklistType) {
          case 'nsfl':
            worklistType = strings('EXCEPTION.NSFL');
            break;
          case 'po':
            worklistType = strings('EXCEPTION.PRICE_OVERRIDE');
            break;
          case 'np':
            worklistType = strings('EXCEPTION.NIL_PICK');
            break;
          case 'ns':
            worklistType = strings('EXCEPTION.NO_SALES');
            break;
          case 'no':
            worklistType = strings('EXCEPTION.NEGATIVE_ON_HANDS');
            break;
          case 'c':
            worklistType = strings('EXCEPTION.CANCELLED');
            break;
          default:
            worklistType = strings('EXCEPTION.UNKNOWN');
        }

        return (
          <WorklistCard
            key={worklist.worklistType}
            goalTitle={worklistType}
            goal={worklist.totalItems}
            complete={worklist.completedItems}
            completionPercentage={(worklist.completedItems / worklist.totalItems) * 100}
            completionGoal={data[this.state.activeGoal].worklistGoalPct}
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
