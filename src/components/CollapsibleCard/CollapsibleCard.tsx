import React, { ReactElement, ReactNode, useState } from 'react';
import {
  Text, TextStyle, TouchableOpacity, View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './CollapsibleCard.style';
import COLOR from '../../themes/Color';
import { TrackEventSource } from '../../models/Generics.d';
import { trackEvent } from '../../utils/AppCenterTool';

interface CollapsibleHeaderCardProps {
    title: string;
    isOpened: boolean;
    toggleIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
    icon: string;
    titleStyle: TextStyle | undefined;
    trackEventSource: TrackEventSource | undefined;
}

interface CollapsibleCardProps {
    title: string;
    isOpened?: boolean;
    children: ReactNode | ReactElement;
    icon?: string;
    titleStyle?: TextStyle;
    source?: TrackEventSource;
}

export const CollapsibleHeaderCard = (props: CollapsibleHeaderCardProps): JSX.Element => {
  const {
    icon, title, isOpened, toggleIsOpened, titleStyle, trackEventSource
  } = props;
  const iconName = isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';

  return (
    <View style={styles.menuContainer}>
      <View style={styles.titleContainer}>
        <Text style={{ marginRight: icon ? 10 : 0 }}>
          {icon && (
          <MaterialCommunityIcon
            name={icon}
            size={20}
            color={COLOR.GREY_700}
          />
          )}
        </Text>
        <Text style={titleStyle}>{title}</Text>
      </View>
      <TouchableOpacity
        testID="collapsible-card"
        style={styles.arrowView}
        onPress={() => {
          toggleIsOpened(!isOpened);
          if (trackEventSource) {
            trackEvent(trackEventSource.screen, {
              action: trackEventSource.action,
              ...trackEventSource.otherInfo
            });
          }
        }}
      >
        <MaterialIcons name={iconName} size={25} color={COLOR.BLACK} />
      </TouchableOpacity>
    </View>
  );
};

export const CollapsibleCard = (props: CollapsibleCardProps): JSX.Element => {
  const {
    icon, title, children, isOpened, titleStyle, source
  } = props;

  const [cardOpen, toggleCardOpen] = useState(isOpened || false);

  return (
    <View>
      <CollapsibleHeaderCard
        title={title}
        isOpened={cardOpen}
        toggleIsOpened={toggleCardOpen}
        icon={icon || ''}
        titleStyle={titleStyle}
        trackEventSource={source}
      />
      {cardOpen && (
      <View>
        {children}
      </View>
      )}
    </View>
  );
};

CollapsibleCard.defaultProps = {
  isOpened: false,
  icon: '',
  titleStyle: {},
  source: undefined
};

export default CollapsibleCard;
