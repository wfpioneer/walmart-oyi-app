import React from 'react';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface ClearCardProps {
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean,
  text: string,
  onPress: () => void
}

const BottomSheetClearAisle = (props: ClearCardProps): JSX.Element | null => {
  const {
    isVisible,
    text,
    onPress
  } = props;

  return isVisible && isVisible ? (
    <BottomSheetBaseCard
      image={require('../../assets/images/clear_button_dark_grey.png')}
      onPress={onPress}
      text={text}
    />
  ) : null;
};

export default BottomSheetClearAisle;
