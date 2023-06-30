/* eslint-disable react/require-default-props */
import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface MultiBinCardProps {
  enableMultiBin: boolean;
  text: string;
  onPress: () => void;
}

const BottomSheetMultiBinCard = (props: MultiBinCardProps): JSX.Element => {
  const {
    enableMultiBin, text, onPress
  } = props;

  return (
    <BottomSheetBaseCard
      materialIconName={enableMultiBin ? 'checkbox-multiple-outline' : 'checkbox-blank-outline'}
      onPress={onPress}
      text={text}
    />
  );
};

export default BottomSheetMultiBinCard;
