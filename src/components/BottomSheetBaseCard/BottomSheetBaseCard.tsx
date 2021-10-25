import { BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Image, Text } from 'react-native';
import styles from './BottomSheetBaseCard.style';

interface BaseCardProps {
  image: { uri: string },
  text: string,
  onPress: () => void
}

const BottomSheetBaseCard = (props: BaseCardProps): JSX.Element => {
  const { image, text, onPress } = props;

  return (
    <BottomSheetView style={styles.container}>
      <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
        <BottomSheetView style={styles.imageView}>
          <Image
            style={styles.image}
            source={image}
            defaultSource={require('../../assets/images/placeholder.png')}
          />
        </BottomSheetView>
        <BottomSheetView style={styles.textView}>
          <Text style={styles.text}>{text}</Text>
        </BottomSheetView>
      </TouchableOpacity>
    </BottomSheetView>
  );
};

export default BottomSheetBaseCard;
