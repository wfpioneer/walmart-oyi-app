import { evaluate, format } from 'mathjs';
import React, { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import COLOR from '../../themes/Color';
import styles from './Calculator.style';
import { strings } from '../../locales';

const operandRegex = /\+|\*|\/|(?<=(\d|\)))-|^-$/;
const allOperandRegex = /-|\+|\*|\/|(?<=(\d|\)))-|^-$/;
const openParent = /\(/;
const closeParent = /\)/;
const decimalNotPartOfNumberRegex = /.\.\D|.\.$|^\.\D|\.\.|^\.$|\d*\.\d*\.\d*/;
const parenthesesRegex = new RegExp(`${openParent.source}|${closeParent.source}`);
const opAndParentRegex = new RegExp(`${operandRegex.source}|${parenthesesRegex.source}`);
const lastOpOrParentRegex = new RegExp(`(${opAndParentRegex.source})(?!.*(${opAndParentRegex.source}))`);
const doubleOperandRegex = new RegExp(`(${allOperandRegex.source}){2}`);
const emptyParentsRegex = new RegExp(`${openParent.source}${closeParent.source}`);
const opAtStartRegex = new RegExp(`^(${operandRegex.source})`);
const opAtEndRegex = new RegExp(`(${operandRegex.source})$`);
const opAtEdgeOfParentRegex = new RegExp(
  `${openParent.source}(${operandRegex.source})|(${operandRegex.source})${closeParent.source}`
);

interface CalculatorProps {
  onEquals?: (result: number) => void;
  onClear?: () => void;
  showNegValidation?: boolean
}

const Calculator = (props: CalculatorProps) => {
  const { onEquals, onClear, showNegValidation } = props;
  const [calcText, setCalcText] = useState('');
  const [calcPaperTape, setCalcPaperTape] = useState('');
  const [isCalcInvalid, setIsCalcInvalid] = useState(false);
  const [currentCalculatedValue, setCurrentCalculatedValue] = useState('');
  const scrollRef = useRef<any>();

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: false });
    }
  };

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

  const onClearPress = () => {
    setCalcText('');
    setIsCalcInvalid(false);
  };

  const onClearAllPress = () => {
    if (onClear) {
      onClear();
    }
    setCalcText('');
    setCalcPaperTape('');
    setCurrentCalculatedValue('');
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

  const updatePaperTape = (newCalcText: string, result: string) => {
    const firstNumber = newCalcText ? newCalcText.split(operandRegex)[0] : '';
    if (currentCalculatedValue.toString() === firstNumber) {
      const stringToAppendWith = calcPaperTape.replace(/[^=]+$/, '');
      setCalcPaperTape(`${stringToAppendWith}${newCalcText}=${result}`);
    } else {
      setCalcPaperTape(`${newCalcText}=${result}`);
    }
  };

  const onEqualsPress = () => {
    if (isValidSyntax(true)) {
      const calculatedValue = evaluate(calcText);
      const valueHasDecimalNumber = calculatedValue % 1 !== 0;
      const result: string = valueHasDecimalNumber
        ? format(calculatedValue, { precision: 1, notation: 'fixed' }) : calculatedValue.toString();
      updatePaperTape(calcText, result);
      setCurrentCalculatedValue(result);
      setCalcText(result);
      if (onEquals) {
        onEquals(Number(result));
      }
    } else {
      setIsCalcInvalid(true);
    }
  };

  const onType = (char: string) => {
    // Enter new value and intiating new calc
    if (currentCalculatedValue && currentCalculatedValue === calcText && char.search(operandRegex) < 0) {
      setCalcText(`${char}`);
    } else if (currentCalculatedValue && calcText === '' && char.search(operandRegex) >= 0) {
      // Enter operand after clearing the input
      setCalcText(`${currentCalculatedValue}${char}`);
    } else {
      setCalcText(`${calcText}${char}`);
    }
    setIsCalcInvalid(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <ScrollView
          horizontal={true}
          style={styles.inputScrollView}
          automaticallyAdjustContentInsets={true}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
          ref={scrollRef}
        >
          <Text testID="calc-paper-tape" style={styles.calcPaperTape}>
            {calcPaperTape}
          </Text>
        </ScrollView>
        <View>
          <TextInput
            editable={false}
            testID="calc-text"
            style={{ ...styles.input, color: COLOR.BLACK }}
          >
            {calcText}
          </TextInput>
        </View>
      </View>
      {isCalcInvalid && (
        <Text style={styles.highlightedErrorText}>
          {strings('AUDITS.INVALID_EQUATION')}
        </Text>
      )}
      {(showNegValidation && parseInt(calcText, 10) < 0) && (
        <Text style={styles.errorText}>
          {strings('AUDITS.NEGATIVE_VALIDATION')}
        </Text>
      )}
      <View style={styles.keyboardContainer}>
        <View style={styles.buttonRow}>
          <Pressable style={styles.calcButtonView} onPress={() => onClearPress()} testID="clear">
            <Text style={styles.calcButtonText}>C</Text>
          </Pressable>
          <Pressable style={styles.calcButtonView} onPress={() => onClearAllPress()} testID="allClear">
            <Text style={styles.calcButtonText}>AC</Text>
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
          <Pressable style={styles.calcButtonView} onPress={() => onType('/')} testID="divide">
            <Text style={styles.calcButtonText}>/</Text>
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
          <Pressable style={styles.calcButtonView} onPress={() => onType('*')} testID="multiply">
            <Text style={styles.calcButtonText}>*</Text>
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
          <Pressable style={styles.calcButtonView} onPress={() => onType('-')} testID="subtract">
            <Text style={styles.calcButtonText}>-</Text>
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
          <Pressable style={styles.calcButtonView} onPress={() => onType('+')} testID="add">
            <Text style={styles.calcButtonText}>+</Text>
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
              ...styles.equalBtn,
              backgroundColor: (currentCalculatedValue === calcText || !calcText.length)
                ? COLOR.GREY : COLOR.MAIN_THEME_COLOR
            }}
            disabled={currentCalculatedValue === calcText || !calcText.length}
            onPress={() => onEqualsPress()}
            testID="equals"
          >
            <Text style={styles.calcButtonText}>=</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

Calculator.defaultProps = {
  onEquals: () => {},
  onClear: () => {},
  showNegValidation: false
};

export default Calculator;
