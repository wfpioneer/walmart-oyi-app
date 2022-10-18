import { evaluate } from 'mathjs';
import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import COLOR from '../../themes/Color';
import { UseStateType } from '../../models/Generics.d';
import styles from './Calculator.style';
import { strings } from '../../locales';

const operandRegex = /\+|\*|\/|(\d|\))-/;
const openParent = /\(/;
const closeParent = /\)/;
const parenthesesRegex = new RegExp(`${openParent.source}|${closeParent.source}`);
const opAndParentRegex = new RegExp(`${operandRegex.source}|${parenthesesRegex.source}`);
const lastOpOrParentRegex = new RegExp(`(${opAndParentRegex.source})(?!.*(${opAndParentRegex.source}))`);
const doubleOperandRegex = new RegExp(`(${operandRegex.source}){2}`);
const opAtStartRegex = new RegExp(`^(${operandRegex.source})`);
const opAtEndRegex = new RegExp(`(${operandRegex.source})$`);
const opAtEdgeOfParentRegex = new RegExp(
  `${openParent.source}(${operandRegex.source})|(${operandRegex.source})${closeParent.source}`
);

interface CalculatorProps {
  calcTextState: UseStateType<string>;
  setIsCalculated: UseStateType<boolean>[1];
}

const Calculator = (props: CalculatorProps) => {
  const [calcText, setCalcText] = props.calcTextState;
  const { setIsCalculated } = props;
  const [isCalcInvalid, setIsCalcInvalid] = useState(false);

  const doOrCanParenthesesClose = (index: number, parentsMustClose: boolean, openingParents = 0): boolean => {
    const nextOpeningParent = calcText.indexOf('(', index);
    const nextClosingParent = calcText.indexOf(')', index);
    if (nextClosingParent >= 0 && nextOpeningParent >= 0) {
      // both opening and closing parentheses
      if (nextClosingParent < nextOpeningParent) {
        if (openingParents) {
          return doOrCanParenthesesClose(nextClosingParent + 1, parentsMustClose, openingParents - 1);
        }
        // Closing parent without opening parents, bad syntax
        return false;
      }
      return doOrCanParenthesesClose(nextOpeningParent + 1, parentsMustClose, openingParents + 1);
    }
    if (nextClosingParent >= 0) {
      // no more opening parentheses
      if (openingParents) {
        return doOrCanParenthesesClose(nextClosingParent + 1, parentsMustClose, openingParents - 1);
      }
      return false;
    }
    if (nextOpeningParent >= 0) {
      // no more closing parentheses
      if (parentsMustClose) {
        return false;
      }
      return true;
    }
    // no more parentheses
    if (parentsMustClose && openingParents) {
      return false;
    }
    return true;
  };

  const isValidSyntax = (isOnSubmit = false) => !(calcText.length && (
    calcText.search(doubleOperandRegex) >= 0
    || calcText.search(opAtStartRegex) >= 0
    || calcText.search(opAtEdgeOfParentRegex) >= 0
    || (isOnSubmit && calcText.search(opAtEndRegex) >= 0)
    || !doOrCanParenthesesClose(0, isOnSubmit)
  ));

  const onClear = () => {
    setCalcText('');
    setIsCalculated(false);
    setIsCalcInvalid(false);
  };

  const onDelete = (shouldDeleteNumber = false) => {
    if (calcText.length) {
      if (shouldDeleteNumber) {
        // If deleting a digit this will delete the entire number
        const lastOperandIndex = calcText.search(lastOpOrParentRegex);
        if (lastOperandIndex === calcText.length - 1) {
          // last char is an operator
          setCalcText(calcText.substring(0, lastOperandIndex));
        } else {
          // last char is part of a number, delete everything following last operator
          setCalcText(calcText.substring(0, lastOperandIndex + 1));
        }
      } else {
        // Delete single character
        setCalcText(calcText.substring(0, calcText.length - 1));
      }
      setIsCalcInvalid(false);
    }
  };

  const onEquals = () => {
    if (isValidSyntax(true)) {
      setCalcText(evaluate(calcText));
      setIsCalculated(true);
    } else {
      setIsCalcInvalid(true);
    }
  };

  const onType = (char: string) => {
    setIsCalculated(false);
    setCalcText(`${calcText}${char}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          editable={false}
          style={{ ...styles.input, color: COLOR.BLACK }}
        >
          {calcText}
        </TextInput>
      </View>
      {(!isValidSyntax() || isCalcInvalid) && (
        <Text style={isCalcInvalid ? styles.highlightedErrorText : styles.errorText}>
          {strings('AUDITS.INVALID_EQUATION')}
        </Text>
      )}
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onClear()}>
          <Text style={styles.calcButtonText}>C</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('(')}>
          <Text style={styles.calcButtonText}>(</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType(')')}>
          <Text style={styles.calcButtonText}>)</Text>
        </Pressable>
        <Pressable
          style={styles.calcButtonView}
          onPress={() => onDelete()}
          onLongPress={() => onDelete(true)}
          delayLongPress={1500}
        >
          <Text style={styles.calcButtonText}>Del</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('7')}>
          <Text style={styles.calcButtonText}>7</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('8')}>
          <Text style={styles.calcButtonText}>8</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('9')}>
          <Text style={styles.calcButtonText}>9</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('/')}>
          <Text style={styles.calcButtonText}>/</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('4')}>
          <Text style={styles.calcButtonText}>4</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('5')}>
          <Text style={styles.calcButtonText}>5</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('6')}>
          <Text style={styles.calcButtonText}>6</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('*')}>
          <Text style={styles.calcButtonText}>*</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('1')}>
          <Text style={styles.calcButtonText}>1</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('2')}>
          <Text style={styles.calcButtonText}>2</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('3')}>
          <Text style={styles.calcButtonText}>3</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('-')}>
          <Text style={styles.calcButtonText}>-</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('.')}>
          <Text style={styles.calcButtonText}>.</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('0')}>
          <Text style={styles.calcButtonText}>0</Text>
        </Pressable>
        <Pressable
          style={{
            ...styles.calcButtonView,
            backgroundColor: isValidSyntax() ? COLOR.MAIN_THEME_COLOR : COLOR.DISABLED_BLUE
          }}
          onPress={() => onEquals()}
        >
          <Text style={styles.calcButtonText}>=</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('+')}>
          <Text style={styles.calcButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Calculator;
