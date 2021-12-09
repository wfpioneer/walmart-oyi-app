import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface EditCardProps {
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean;
  text: string;
  onPress: () => void;
}

const BottomSheetEditCard = (props: EditCardProps): JSX.Element | null => {
  const { isVisible, text, onPress } = props;

  return isVisible ? (
    <BottomSheetBaseCard
      image={require('../../assets/images/edit.png')}
      onPress={onPress}
      text={text}
    />
  ) : null;
};

export default BottomSheetEditCard;
