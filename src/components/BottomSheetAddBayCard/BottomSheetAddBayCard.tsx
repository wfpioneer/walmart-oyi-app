import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface AddBayCardProps {
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean,
  text: string,
  onPress: () => void
}

const BottomSheetAddBayCard = (props: AddBayCardProps): JSX.Element | null => {
  const {
    isVisible,
    text,
    onPress
  } = props;

  return isVisible && isVisible ? (
    <BottomSheetBaseCard
      image={require('../../assets/images/add_circle_dark_grey.png')}
      onPress={onPress}
      text={text}
    />
  ) : null;
};

export default BottomSheetAddBayCard;
