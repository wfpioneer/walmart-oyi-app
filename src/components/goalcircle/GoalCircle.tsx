import React from 'react';
import { Text, View } from 'react-native';
import styles from './GoalCircle.style';

export interface Props {
    goalTitle: string;
    completionPercentage: number;
    completionGoal?: number;
    active: boolean;
    key: string;
    frequency: string;
}

function GoalCircle(props: Props) {
  const target = (props.completionGoal) ? props.completionGoal : 95;
  const atGoalStyle = (props.completionPercentage >= target) ? styles.goalMet : styles.goalNotMet;
  const ringTwoStyle = (props.completionPercentage >= 50) ? atGoalStyle : styles.under50;
  // Calculate the transformation degrees to correctly position half-circle #1.
  const transfOne = (props.completionPercentage >= 50) ? 180 : (props.completionPercentage * 3.6);
  // Calculate the transformation degrees to correctly position half-circle #2.
  const transfTwo = (props.completionPercentage >= 50) ? (props.completionPercentage * 3.6) : 0;
  const goalStyle = props.active ? styles.goalNameActive : styles.goalNameInactive;

  return (
    <View>
      <View style={styles.baseRing}>
        <View style={[styles.container, { transform: [{ rotate: `${transfOne}deg` }] }]}>
          <View style={[atGoalStyle, styles.halfRing]} />
        </View>
        <View style={[styles.container, { transform: [{ rotate: `${transfTwo}deg` }] }]}>
          <View style={[ringTwoStyle, styles.halfRing]} />
        </View>
        <View style={styles.centerRing}>
          <Text style={styles.goalDisp}>
            {props.completionPercentage}
            %
          </Text>
        </View>
      </View>
      <Text style={styles.freq}>{props.frequency}</Text>
      <Text style={goalStyle}>{props.goalTitle}</Text>
    </View>
  );
}

export default GoalCircle;
