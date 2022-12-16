import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import styles from './Stars.style';

export interface StarsComponentProps {
  initialValue: number
  onValueChange: (val: number) => void;
  size?: number
  starCount?: number;
}

const getRateDescription = (rate: number) => {
  switch (rate) {
    case 1:
      return strings('FEEDBACK.VERY_POOR_RATE_LABEL');
    case 2:
      return strings('FEEDBACK.POOR_RATE_LABEL');
    case 3:
      return strings('FEEDBACK.AVERAGE_RATE_LABEL');
    case 4:
      return strings('FEEDBACK.GOOD_RATE_LABEL');
    case 5:
      return strings('FEEDBACK.EXCELLENT_RATE_LABEL');
    default:
      return '';
  }
};

const Stars = (props: StarsComponentProps) => {
  const {
    starCount,
    onValueChange,
    size,
    initialValue
  } = props;

  const [currentRating, setCurrentRating] = useState(initialValue);

  useEffect(() => {
    onValueChange(currentRating);
  }, [currentRating]);

  return (
    <View style={styles.container}>
      <View style={styles.rateContainer}>
        {[...Array(starCount).keys()].map(index => (
          <TouchableOpacity
            key={`star-${index}`}
            onPress={() => setCurrentRating(index + 1)}
            testID={`star-icon-${index}`}
          >
            <MaterialCommunityIcon
              name={index + 1 <= currentRating ? 'star' : 'star-outline'}
              size={size}
              color={COLOR.GOLD}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Text>{getRateDescription(currentRating)}</Text>
      </View>
    </View>
  );
};

Stars.defaultProps = {
  size: 30,
  starCount: 5
};

export default Stars;
