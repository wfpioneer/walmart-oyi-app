import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface PrintCardProps {
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean;
  text: string;
  onPress: () => void;
}

const BottomSheetPrintCard = (props: PrintCardProps): JSX.Element | null => {
  const { isVisible, text, onPress } = props;

  return isVisible ? (
    <BottomSheetBaseCard
      image={require('../../assets/images/printer_dark_grey.png')}
      onPress={onPress}
      text={text}
    />
  ) : null;
};

export default BottomSheetPrintCard;
