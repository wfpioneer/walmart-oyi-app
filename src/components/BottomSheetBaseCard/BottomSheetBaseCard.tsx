import { BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Image, Text } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './BottomSheetBaseCard.style';

interface BaseCardProps {
  image?: { uri: string };
  text: string;
  onPress: () => void;
  materialIconName?: string;
}

const BottomSheetBaseCard = (props: BaseCardProps): JSX.Element => {
  const {
    image, text, onPress, materialIconName
  } = props;

  return (
    <BottomSheetView style={styles.container}>
      <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
        <BottomSheetView style={styles.imageView}>
          {!materialIconName ? (
            <Image
              style={styles.image}
              source={image || require('../../assets/images/placeholder.png')}
            />
          ) : null}
          {materialIconName ? (
            <MaterialCommunityIcon size={40} name={materialIconName} />
          ) : null}
        </BottomSheetView>
        <BottomSheetView style={styles.textView}>
          <Text style={styles.text}>{text}</Text>
        </BottomSheetView>
      </TouchableOpacity>
    </BottomSheetView>
  );
};

export default BottomSheetBaseCard;

BottomSheetBaseCard.defaultProps = {
  materialIconName: '',
  image: undefined
};
