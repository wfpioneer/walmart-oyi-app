import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import styles from './WorklistCard.style';
import { strings } from '../../locales';

/**
 * Basic worklist card component to be populated with worklist items as needed.
 */
export interface WorkListCardProps {
    goalTitle: string;
    goal: number;
    complete: number;
    completionPercentage: number;
    completionGoal: number;
    onPress: () => void;
    inProgress: boolean;
    pendingPercentage: number;
}

function WorklistCard(props: WorkListCardProps): JSX.Element {
  const {
    complete, completionGoal, completionPercentage, goal, goalTitle, onPress, pendingPercentage, inProgress
  } = props;

  const getBarFill = () => {
    if (goal === 0) {
      return styles.barFillNoItems;
    }

    // Renders completion percentage as green if inProgress flag is enabled
    if (inProgress) {
      return styles.barFillAtGoal;
    }
    return completionPercentage >= completionGoal ? styles.barFillAtGoal : styles.barFillNotAtGoal;
  };
  return (
    <TouchableOpacity testID="btnCard" style={styles.card} onPress={onPress}>
      <View style={styles.head}>
        <Text style={styles.title}>{goalTitle}</Text>
        <Text style={styles.progress}>
          {`${strings('GENERICS.GOAL')} ${completionGoal}%`}
        </Text>
      </View>
      <View style={styles.progressBar}>
        {inProgress
        && <View style={[StyleSheet.absoluteFill, styles.barFillInProgress, { width: `${pendingPercentage}%` }]} /> }
        <View style={[StyleSheet.absoluteFill, getBarFill(), { width: `${completionPercentage}%` }]} />
      </View>
      <Text style={styles.counter}>
        {strings('HOME.WORKLIST_GOAL_COMPLETE', { complete, total: goal })}
      </Text>
    </TouchableOpacity>
  );
}

export default WorklistCard;
