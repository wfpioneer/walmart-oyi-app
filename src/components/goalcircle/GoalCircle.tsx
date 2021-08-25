import React from 'react';
import { Text, View } from 'react-native';
import styles from './GoalCircle.style';

 interface GoalCircleProps {
    goalTitle: string;
    completionPercentage: number;
    completionGoal: number;
    active: boolean;
    frequency: string;
}

function GoalCircle(props: GoalCircleProps): JSX.Element {
  const {
    active, completionGoal, completionPercentage, frequency, goalTitle
  } = props;

  const atGoalStyle = (completionPercentage >= completionGoal) ? styles.goalMet : styles.goalNotMet;
  const ringTwoStyle = (completionPercentage >= 50) ? atGoalStyle : styles.under50;
  // Calculate the transformation degrees to correctly position half-circle #1.
  const transfOne = (completionPercentage >= 50) ? 180 : (completionPercentage * 3.6);
  // Calculate the transformation degrees to correctly position half-circle #2.
  const transfTwo = (completionPercentage >= 50) ? (completionPercentage * 3.6) : 0;
  const goalStyle = active ? styles.goalNameActive : styles.goalNameInactive;

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
            {completionPercentage}
            %
          </Text>
        </View>
      </View>
      <Text style={styles.freq}>{frequency}</Text>
      <Text style={goalStyle}>{goalTitle}</Text>
    </View>
  );
}

export default GoalCircle;
