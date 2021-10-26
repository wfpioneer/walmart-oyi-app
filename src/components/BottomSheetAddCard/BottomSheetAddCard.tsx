import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface AddCardProps {
  // eslint-disable-next-line react/require-default-props
  isManagerOption?: boolean,
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean,
  text: string,
  onPress: () => void
}

const BottomSheetAddCard = (props: AddCardProps): JSX.Element | null => {
  const {
    isManagerOption,
    isVisible,
    text,
    onPress
  } = props;
  let image;
  if (isManagerOption && isManagerOption) {
    image = require('../../assets/images/add_circle_dark_grey.png');
  } else {
    image = require('../../assets/images/add_circle_light_grey.png');
  }

  return isVisible && isVisible ? (
    <BottomSheetBaseCard
      image={image}
      onPress={onPress}
      text={text}
    />
  ) : null;
};

export default BottomSheetAddCard;
