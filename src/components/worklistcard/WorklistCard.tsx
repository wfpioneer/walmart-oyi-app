import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import styles from './WorklistCard.style';

/**
 * Basic worklist card component to be populated with worklist items as needed.
 */
export interface Props {
    goalTitle: string,
    goal: number,
    complete: number,
    completionPercentage: number,
    completionGoal?: number
};

function WorklistCard(Props:Props) {
    let target;
    Props.completionGoal?(target=Props.completionGoal):(target=95);
    const [atGoal] = useState(((Props.completionPercentage>=target)?styles.barFillAtGoal:styles.barFillNotAtGoal));
    return (
         <View style={styles.card}>
             <View style={styles.head}>
                 <Text style={styles.title}>{Props.goalTitle}</Text>
                 <Text style={styles.progress}>Goal {target}%</Text>
             </View>
             <View style={styles.progressBar}>
                 <View style={[StyleSheet.absoluteFill,atGoal, {width:`${Props.completionPercentage}%`}]} />
             </View>
             <Text style={styles.counter}>{Props.complete} of {Props.goal} items</Text>
         </View>
     )
 };

 export default WorklistCard;