import React, {useState, useEffect} from 'react';
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

function WorklistCard(Props:Props) {
    const [completion, updCompletion] = useState({completionPercentage: ((Props.complete/Props.goal)*100),atGoal:((((Props.complete/Props.goal)*100)>94)?true:false)});
    useEffect(()=>{
        let newGoalState={completionPercentage: ((Props.complete/Props.goal)*100),atGoal:((((Props.complete/Props.goal)*100)>94)?true:false)};
        updCompletion(newGoalState);
    })
    return (
         <View style={styles.card}>
             <View style={styles.head}>
                 <Text style={styles.title}>{Props.goalTitle}</Text>
                 <Text style={styles.progress}>Goal 95%</Text>
             </View>
             <View style={styles.progressBar}>
                 <View style={[StyleSheet.absoluteFill,completion.atGoal?styles.barFillAtGoal:styles.barFillNotAtGoal, {width:`${completion.completionPercentage}%`}]} />
             </View>
             <Text style={styles.counter}>{Props.complete} of {Props.goal} items</Text>
         </View>
     )
 };

 export default WorklistCard;