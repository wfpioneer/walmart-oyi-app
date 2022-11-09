import { evaluate, format } from 'mathjs';
import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import COLOR from '../../themes/Color';
import styles from './Calculator.style';
import { strings } from '../../locales';

const operandRegex = /\+|\*|\/|(?<=(\d|\)))-|^-$/;
const openParent = /\(/;
const closeParent = /\)/;
const decimalNotPartOfNumberRegex = /.\.\D|.\.$|^\.\D|\.\.|^\.$|\d*\.\d*\.\d*/;
const parenthesesRegex = new RegExp(`${openParent.source}|${closeParent.source}`);
const opAndParentRegex = new RegExp(`${operandRegex.source}|${parenthesesRegex.source}`);
const lastOpOrParentRegex = new RegExp(`(${opAndParentRegex.source})(?!.*(${opAndParentRegex.source}))`);
const doubleOperandRegex = new RegExp(`(${operandRegex.source}){2}`);
const emptyParentsRegex = new RegExp(`${openParent.source}${closeParent.source}`);
const opAtStartRegex = new RegExp(`^(${operandRegex.source})`);
const opAtEndRegex = new RegExp(`(${operandRegex.source})$`);
const opAtEdgeOfParentRegex = new RegExp(
  `${openParent.source}(${operandRegex.source})|(${operandRegex.source})${closeParent.source}`
);

interface CalculatorProps {
  onEquals?: (result: number) => void;
  showNegValidation?: boolean
}

const Calculator = (props: CalculatorProps) => {
  const { onEquals, showNegValidation } = props;
  const [calcText, setCalcText] = useState('');
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
    || calcText.search(emptyParentsRegex) >= 0
    || calcText.search(opAtStartRegex) >= 0
    || calcText.search(opAtEdgeOfParentRegex) >= 0
    || calcText.search(decimalNotPartOfNumberRegex) >= 0
    || (isOnSubmit && calcText.search(opAtEndRegex) >= 0)
    || !doOrCanParenthesesClose(0, isOnSubmit)
  ));

  const onClear = () => {
    setCalcText('');
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

  const onEqualsPress = () => {
    if (isValidSyntax(true)) {
      const result: string = format(evaluate(calcText), { precision: 2 });
      setCalcText(result);
      if (onEquals) {
        onEquals(Number(result));
      }
    } else {
      setIsCalcInvalid(true);
    }
  };

  const onType = (char: string) => {
    setCalcText(`${calcText}${char}`);
    setIsCalcInvalid(false);
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
      {(showNegValidation && parseInt(calcText, 10) < 0) && (
        <Text style={styles.errorText}>
          {strings('AUDITS.NEGATIVE_VALIDATION')}
        </Text>
      )}
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onClear()} testID="clear">
          <Text style={styles.calcButtonText}>C</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('(')} testID="openParent">
          <Text style={styles.calcButtonText}>(</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType(')')} testID="closeParent">
          <Text style={styles.calcButtonText}>)</Text>
        </Pressable>
        <Pressable
          style={styles.calcButtonView}
          onPress={() => onDelete()}
          onLongPress={() => onDelete(true)}
          delayLongPress={1500}
          testID="delete"
        >
          <Text style={styles.calcButtonText}>Del</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('7')} testID="seven">
          <Text style={styles.calcButtonText}>7</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('8')} testID="eight">
          <Text style={styles.calcButtonText}>8</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('9')} testID="nine">
          <Text style={styles.calcButtonText}>9</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('/')} testID="divide">
          <Text style={styles.calcButtonText}>/</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('4')} testID="four">
          <Text style={styles.calcButtonText}>4</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('5')} testID="five">
          <Text style={styles.calcButtonText}>5</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('6')} testID="six">
          <Text style={styles.calcButtonText}>6</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('*')} testID="multiply">
          <Text style={styles.calcButtonText}>*</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('1')} testID="one">
          <Text style={styles.calcButtonText}>1</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('2')} testID="two">
          <Text style={styles.calcButtonText}>2</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('3')} testID="three">
          <Text style={styles.calcButtonText}>3</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('-')} testID="subtract">
          <Text style={styles.calcButtonText}>-</Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.calcButtonView} onPress={() => onType('.')} testID="decimal">
          <Text style={styles.calcButtonText}>.</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('0')} testID="zero">
          <Text style={styles.calcButtonText}>0</Text>
        </Pressable>
        <Pressable
          style={{
            ...styles.calcButtonView,
            backgroundColor: isValidSyntax() && calcText.length ? COLOR.MAIN_THEME_COLOR : COLOR.DISABLED_BLUE
          }}
          disabled={!(isValidSyntax() && calcText.length)}
          onPress={() => onEqualsPress()}
          testID="equals"
        >
          <Text style={styles.calcButtonText}>=</Text>
        </Pressable>
        <Pressable style={styles.calcButtonView} onPress={() => onType('+')} testID="add">
          <Text style={styles.calcButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

Calculator.defaultProps = {
  onEquals: () => {},
  showNegValidation: false
};

export default Calculator;
