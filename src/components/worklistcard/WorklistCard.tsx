import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import styles from './WorklistCard.style';

/**
 * Basic worklist card component to be populated with worklist items as needed.
 */

 export interface Props {
     goalTitle: string,
     goal: number,
     complete: number
 };

 export interface State {
     completionPercentage: number,
     atGoal: Boolean
 };

 class WorklistCard extends React.PureComponent<Props, State> {
     constructor(props:Props) {
         super(props);
         this.state={completionPercentage:0, atGoal: false};
     };
     componentDidUpdate() {
         this.calculateCompletion();
     };
     componentDidMount() {
         this.calculateCompletion();
     };
     calculateCompletion() {
         let percent=this.props.complete/this.props.goal;
         this.setState({
            completionPercentage: percent*100
        });
        this.checkGoal();
    };
    checkGoal() {
        if (this.state.completionPercentage>94) {
            this.setState({
                atGoal: true
            });
        };
    };
     render() {
         return (
             <View style={styles.card}>
                 <View style={styles.head}>
                    <Text style={styles.title}>{this.props.goalTitle}</Text>
                    <Text style={styles.progress}>Goal 95%</Text>
                 </View>
                 <View style={styles.progressBar}>
                     <View style={[StyleSheet.absoluteFill,this.state.atGoal?styles.barFillAtGoal:styles.barFillNotAtGoal, {width:`${this.state.completionPercentage}%`}]} />
                 </View>
                 <Text style={styles.counter}>{this.props.complete} of {this.props.goal} items</Text>
             </View>
         )
     };
 };

 export default WorklistCard;