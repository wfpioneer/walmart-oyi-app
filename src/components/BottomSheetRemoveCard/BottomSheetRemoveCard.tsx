import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface RemoveCardProps {
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean,
  text: string,
  onPress: () => void
}

const BottomSheetRemoveCard = (props: RemoveCardProps): JSX.Element | null => {
  const {
    isVisible,
    text,
    onPress
  } = props;

  return isVisible && isVisible ? (
    <BottomSheetBaseCard
      image={require('../../assets/images/trash_can.png')}
      onPress={onPress}
      text={text}
    />
  ) : null;
};

export default BottomSheetRemoveCard;
