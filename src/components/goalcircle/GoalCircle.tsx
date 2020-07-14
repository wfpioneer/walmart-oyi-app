import React, {useState, useEffect} from "react";
import styles from "./GoalCircle.style";
import { View, Text } from "react-native";

export interface Props {
    goalTitle: string,
    completionPercentage: number,
    completionGoal?: number
};

function GoalCircle(Props:Props) {
    let target;
    Props.completionGoal?(target=Props.completionGoal):(target=95);
    let atGoal=(Props.completionPercentage>=target)?styles.goalMet:styles.goalNotMet;
    let ringTwo=(Props.completionPercentage>=50)?atGoal:styles.under50;
    let transfOne=(Props.completionPercentage>=50)?180:(Props.completionPercentage*3.6);
    let transfTwo=(Props.completionPercentage>=50)?(Props.completionPercentage*3.6):0;
    return (
        <View>
            <View style={styles.baseRing}>
                <View style={[styles.container, {transform: [{rotate:`${transfOne}deg`}]}]}>
                    <View style={[atGoal, styles.halfRing]}/>
                </View>
                <View style={[styles.container, {transform: [{rotate: `${transfTwo}deg`}]}]}>
                    <View style={[ringTwo, styles.halfRing]}/>
                </View>
                <View style={styles.centerRing}>
                    <Text style={styles.goalDisp}>{Props.completionPercentage}%</Text>
                </View>
            </View>
            <Text style={styles.freq}>Daily</Text>
            <Text style={styles.goalNameActive}>Items</Text>
        </View>
    )
};

export default GoalCircle;