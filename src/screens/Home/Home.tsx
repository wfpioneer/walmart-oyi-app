import React from 'react';
import { connect } from 'react-redux';
import {
  EmitterSubscription, SafeAreaView, ScrollView, Text, View
} from 'react-native';
import styles from './Home.style';
import { StackNavigationProp } from '@react-navigation/stack';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setManualScan, setScannedEvent } from '../../state/actions/Global';
import ManualScanComponent from '../../components/manualscan/ManualScan';
import WorklistCard from '../../components/worklistcard/WorklistCard';
import GoalCircle from "../../components/goalcircle/GoalCircle";

const mapStateToProps = (state: any) => {
  return {
    userName: state.User.additional.displayName,
    isManualScanEnabled: state.Global.isManualScanEnabled
  };
};

const mapDispatchToProps = {
  setScannedEvent,
  setManualScan
};

interface HomeScreenProps {
  userName: string;
  hitGoogle: Function;
  setScannedEvent: Function;
  setManualScan: Function;
  googleLoading: boolean;
  googleResult: string;
  googleError: string;
  isManualScanEnabled: boolean;
  navigation: StackNavigationProp<any>;
}

export class HomeScreen extends React.PureComponent<HomeScreenProps> {
  private readonly scannedSubscription: EmitterSubscription;

  constructor(props: HomeScreenProps) {
    super(props);

    this.scannedSubscription = barcodeEmitter.addListener('scanned', (scan) => {
      if(props.navigation.isFocused()) {
        console.log('home received scan', scan.value, scan.type);
        props.setScannedEvent(scan);
        props.setManualScan(false);
        props.navigation.navigate('ReviewItemDetails');
      }
    });
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
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {this.props.isManualScanEnabled && <ManualScanComponent />}
        <ScrollView contentContainerStyle={styles.container}>
          <Text>
            { `Welcome ${this.props.userName}` }
          </Text>
          <View style={styles.horizontalContainer}>
            <GoalCircle goalTitle="Items" completionPercentage={65} active={true} frequency="Daily"/>
            <GoalCircle goalTitle="Pallets" completionPercentage={95} active={false} frequency="Daily"/>
            <GoalCircle goalTitle="Audits" completionPercentage={30} active={false} frequency="Weekly"/>
          </View>
          <WorklistCard goalTitle="Sample" goal={25} complete={23} completionPercentage={(23/25)*100} completionGoal={98}/>
          <WorklistCard goalTitle="Second Sample" goal={10} complete={3} completionPercentage={(3/10)*100} completionGoal={30}/>
          <WorklistCard goalTitle="100% Completion Sample" goal={200} complete={200} completionPercentage={100}/>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
