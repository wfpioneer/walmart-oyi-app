/* eslint-disable react/require-default-props */
import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface AddCardProps {
  isManagerOption?: boolean;
  isVisible?: boolean;
  text: string;
  onPress: () => void;
}

const BottomSheetAddCard = (props: AddCardProps): JSX.Element | null => {
  const {
    isManagerOption, isVisible, text, onPress
  } = props;
  let image;
  if (isManagerOption) {
    image = require('../../assets/images/add_circle_dark_grey.png');
  } else {
    image = require('../../assets/images/add_circle_light_grey.png');
  }

  return isVisible ? (
    <BottomSheetBaseCard image={image} onPress={onPress} text={text} />
  ) : null;
};

export default BottomSheetAddCard;
