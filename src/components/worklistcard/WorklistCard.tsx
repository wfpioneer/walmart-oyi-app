import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import styles from './WorklistCard.style';
import { strings } from '../../locales';

/**
 * Basic worklist card component to be populated with worklist items as needed.
 */
export interface Props {
    goalTitle: string;
    goal: number;
    complete: number;
    completionPercentage: number;
    completionGoal?: number;
    onPress: () => void;
}

function WorklistCard(Props: Props) {
  let target;
  if (Props.completionGoal) {
    target = Props.completionGoal;
  } else {
    target = 95;
  }
  const [atGoal] = useState(((Props.completionPercentage >= target) ? styles.barFillAtGoal : styles.barFillNotAtGoal));

  return (
    <TouchableOpacity style={styles.card} onPress={Props.onPress}>
      <View style={styles.head}>
        <Text style={styles.title}>{Props.goalTitle}</Text>
        <Text style={styles.progress}>
          {`${strings('GENERICS.GOAL')} ${target}%`}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[StyleSheet.absoluteFill, atGoal, { width: `${Props.completionPercentage}%` }]} />
      </View>
      <Text style={styles.counter}>
        {strings('HOME.WORKLIST_GOAL_COMPLETE', { complete: Props.complete, total: Props.goal })}
      </Text>
    </TouchableOpacity>
  );
}

export default WorklistCard;
