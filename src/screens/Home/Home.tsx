import React from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator, SafeAreaView, ScrollView, Text, View
} from 'react-native';
import Button from '../../components/button/Button';
import { hitGoogle } from '../../state/actions/saga';
import styles from './Home.style';
import COLOR from '../../themes/Color';
import WorklistCard from '../../components/worklistcard/WorklistCard';
import GoalCircle from "../../components/goalcircle/GoalCircle";
import containers from "../../components/containerstyles/ContainerStyles.style";

const mapStateToProps = (state: any) => {
  const googleResult = state.async.hitGoogle.result && state.async.hitGoogle.result.data;
  return {
    userName: state.User.additional.displayName,
    googleLoading: state.async.hitGoogle.isWaiting,
    googleResult,
    googleError: state.async.hitGoogle.error
  };
};

const mapDispatchToProps = {
  hitGoogle
};

interface HomeScreenProps {
  userName: string;
  hitGoogle: Function;
  googleLoading: boolean;
  googleResult: string;
  googleError: string;
}

export class HomeScreen extends React.PureComponent<HomeScreenProps> {
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
          <View style={containers.horizontalContainer}>
            <GoalCircle goalTitle="Circle Samp" completionPercentage={65}/>
            <GoalCircle goalTitle="Sample Two" completionPercentage={95}/>
            <GoalCircle goalTitle="Under Half" completionPercentage={30}/>
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
