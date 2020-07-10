import React, { ReactElement, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ReactNodeLike } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './SFTCard.styles';
import COLOR from '../../themes/Color';
import Button from '../button/Button';

interface SFTCardProps {
  iconName: string;
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
    <View style={{flexDirection: 'row', padding: 16, justifyContent: 'flex-end'}}>
      {!actionFunc &&
        <Text style={{color: COLOR.GREY_600}}>
          {textArray[0]}
        </Text>
      }
      {actionFunc &&
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          {textArray.map((value, index) => {
            return (
              <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  <Text style={{marginLeft: 12, marginRight: 12, color: COLOR.GREY_500, fontSize: 18}}>
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

  const { iconName, title, topRightBtnTxt, topRightBtnAction, bottomRightBtnTxt, bottomRightBtnAction, children } = props;

  return (
    <View style={{marginTop: 8, backgroundColor: "white", alignSelf: 'stretch'}} >
      <View style={{padding: 16, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLOR.GREY_100}} >
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Icon name={iconName} size={15} color={COLOR.GREY_800} style={{marginRight: 8}} />
          <Text style={{marginLeft: 8}}>{title}</Text>
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
