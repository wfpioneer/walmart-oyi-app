import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './GoalCircle.style';

 interface GoalCircleProps {
    goalTitle: string;
    completionPercentage: number;
    completionGoal: number;
    active: boolean;
    frequency: string;
    onPress: () => void
}

function GoalCircle(props: GoalCircleProps): JSX.Element {
  const {
    active, completionGoal, completionPercentage, frequency, goalTitle, onPress
  } = props;

  const atGoalStyle = (completionPercentage >= completionGoal) ? styles.goalMet : styles.goalNotMet;
  const ringTwoStyle = (completionPercentage >= 50) ? atGoalStyle : styles.under50;
  // Calculate the transformation degrees to correctly position half-circle #1.
  const transfOne = (completionPercentage >= 50) ? 180 : (completionPercentage * 3.6);
  // Calculate the transformation degrees to correctly position half-circle #2.
  const transfTwo = (completionPercentage >= 50) ? (completionPercentage * 3.6) : 0;
  const goalStyle = active ? styles.goalNameActive : styles.goalNameInactive;

  return (
    <View style={styles.wrapperContainer}>
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
      <TouchableOpacity testID="btnGoalTitleClick" onPress={onPress}>
        <Text style={goalStyle} testID="txtGoalTitle">{goalTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default GoalCircle;
