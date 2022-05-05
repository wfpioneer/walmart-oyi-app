import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../themes/Color';
import BottomSheetBaseCard from '../BottomSheetBaseCard/BottomSheetBaseCard';

interface RemoveCardProps {
  // eslint-disable-next-line react/require-default-props
  isVisible?: boolean;
  text: string;
  onPress: () => void;
}

const BottomSheetRemoveCard = (props: RemoveCardProps): JSX.Element | null => {
  const { isVisible, text, onPress } = props;
  const [deleteIcon, setDeleteIcon] = useState<{ uri: string } | undefined>(undefined);

  useEffect(() => {
    Icon.getImageSource('trash-can', 30, COLOR.TRACKER_GREY).then(source => setDeleteIcon(source));
  }, []);

  return isVisible ? (
    <BottomSheetBaseCard
      image={deleteIcon}
      onPress={onPress}
      text={text}
    />
  ) : null;
};

export default BottomSheetRemoveCard;
