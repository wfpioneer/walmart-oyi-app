import React from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator, EmitterSubscription, SafeAreaView, ScrollView, Text
} from 'react-native';
import Button from '../../components/button/Button';
import { hitGoogle } from '../../state/actions/saga';
import styles from './Home.style';
import COLOR from '../../themes/Color';
import { StackNavigationProp } from '@react-navigation/stack';
import { barcodeEmitter } from '../../utils/scannerUtils';
import { setScannedEvent } from '../../state/actions/Global';

const mapStateToProps = (state: any) => {
  const googleResult = state.async.hitGoogle.result && state.async.hitGoogle.result.data;
  return {
    userName: state.User.additional.displayName,
    googleLoading: state.async.hitGoogle.isWaiting,
    googleResult,
    googleError: state.async.hitGoogle.error
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    hitGoogle: (payload: any) => dispatch(hitGoogle(payload)),
    setScannedEvent: (event: any) => dispatch(setScannedEvent(event))
  }
};

interface HomeScreenProps {
  userName: string;
  hitGoogle: Function;
  setScannedEvent: Function;
  googleLoading: boolean;
  googleResult: string;
  googleError: string;
  navigation: StackNavigationProp<any>;
}

export class HomeScreen extends React.PureComponent<HomeScreenProps> {
  private readonly scannedSubscription: EmitterSubscription;

  constructor(props: HomeScreenProps) {
    super(props);

    this.scannedSubscription = barcodeEmitter.addListener('scanned', (scan) => {
      console.log('received scan', scan.value, scan.type);
      props.setScannedEvent(scan)
      props.navigation.navigate('ReviewItemDetails')
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
        <ScrollView contentContainerStyle={styles.container}>
          <Text>This is the home screen!</Text>
          <Text>
            { `Welcome ${this.props.userName}` }
          </Text>
          <Button
            type={Button.Type.PRIMARY}
            disabled={this.props.googleLoading}
            title="Ping Google"
            onPress={() => this.props.hitGoogle({ stuff: 'test payload' })}
            style={styles.pingGoogleButton}
          />
          <ActivityIndicator
            animating={this.props.googleLoading}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />
          { this.props.googleResult
          && (
          <Text numberOfLines={10} ellipsizeMode="tail">
            {this.props.googleResult}
          </Text>
          )
        }
          { this.props.googleError
          && (
            <Text>
              {this.props.googleError}
            </Text>
          )
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
