/* eslint-disable react/require-default-props */
import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface ClearCardProps {
  isManagerOption?: boolean;
  isVisible?: boolean;
  text: string;
  onPress: () => void;
}

const BottomSheetClearCard = (props: ClearCardProps): JSX.Element | null => {
  const {
    isManagerOption, isVisible, text, onPress
  } = props;
  let image;
  if (isManagerOption) {
    image = require('../../assets/images/clear_button_dark_grey.png');
  } else {
    image = require('../../assets/images/clear_button_light_grey.png');
  }

  return isVisible ? (
    <BottomSheetBaseCard image={image} onPress={onPress} text={text} />
  ) : null;
};

export default BottomSheetClearCard;
