import React, { ReactElement, ReactNode } from 'react';
import { Text, View } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './SFTCard.styles';
import COLOR from '../../themes/Color';
import Button from '../button/Button';

interface SFTCardProps {
  iconName?: string;
  iconProp?: ReactNode;
  title: string;
  topRightBtnTxt?: string;
  topRightBtnAction?: () => void;
  bottomRightBtnTxt?: string[];
  bottomRightBtnAction?: (index: number) => void;
  children?: ReactNode | ReactElement;
}

const renderBottomRightBtns = (textArray: string[], actionFunc?: (index: number) => void) => {
  const arraySize = textArray.length;
  return (
    <View style={styles.bottomRowContainer}>
      {!actionFunc &&
        <Text style={styles.bottomRowText}>
          {textArray[0]}
        </Text>
      }
      {actionFunc &&
      <View style={styles.bottomRowBtnContainer}>
          {textArray.map((value, index) => {
            return (
              <View key={index} style={styles.bottomRowBtn}>
                <Button
                  type={Button.Type.NO_BORDER}
                  title={value}
                  onPress={() => actionFunc(index)}
                  titleColor={COLOR.MAIN_THEME_COLOR}
                  titleFontSize={14}
                  titleFontWeight={'bold'}
                  height={24}
                />
                {index + 1 !== arraySize &&
                  <Text style={styles.bottomRowDivider}>
                    |
                  </Text>
                }
              </View>
            )
          })}
        </View>
      }
    </View>
  )
}

const SFTCard = (props: SFTCardProps) => {
  const { iconName, iconProp, title, topRightBtnTxt, topRightBtnAction, bottomRightBtnTxt, bottomRightBtnAction, children } = props;

  return (
    <View style={styles.mainContainer} >
      <View style={styles.topRowContainer} >
        <View style={styles.iconTitleContainer}>
          {iconName ?
            <FontAwesome5Icon name={iconName} size={15} color={COLOR.GREY_700} style={styles.icon} />
            :
            <View style={styles.icon}>
              {iconProp}
            </View>
          }
          <Text style={styles.title}>{title}</Text>
        </View>
        {topRightBtnTxt && topRightBtnAction &&
          <Button
            type={Button.Type.NO_BORDER}
            title={topRightBtnTxt}
            onPress={topRightBtnAction}
            titleColor={COLOR.MAIN_THEME_COLOR}
            titleFontSize={14}
            titleFontWeight={'bold'}
            height={24}
          />
        }
      </View>
      { children }
      { bottomRightBtnTxt && renderBottomRightBtns(bottomRightBtnTxt, bottomRightBtnAction)}
    </View>
  )
};

export default SFTCard;
