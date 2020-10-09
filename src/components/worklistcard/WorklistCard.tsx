import React from 'react';
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
  const target = 95;

  const getBarFill = () => {
    console.log(Props);
    if (Props.goal === 0) {
      return styles.barFillNoItems;
    }
    return Props.completionPercentage >= target ? styles.barFillAtGoal : styles.barFillNotAtGoal
  };
  return (
    <TouchableOpacity style={styles.card} onPress={Props.onPress}>
      <View style={styles.head}>
        <Text style={styles.title}>{Props.goalTitle}</Text>
        <Text style={styles.progress}>
          {`${strings('GENERICS.GOAL')} ${target}%`}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[StyleSheet.absoluteFill, getBarFill(), { width: `${Props.completionPercentage}%` }]} />
      </View>
      <Text style={styles.counter}>
        {strings('HOME.WORKLIST_GOAL_COMPLETE', { complete: Props.complete, total: Props.goal })}
      </Text>
    </TouchableOpacity>
  );
}

export default WorklistCard;
