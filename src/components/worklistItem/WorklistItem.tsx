import React from 'react';
import {
  Text, TouchableOpacity, View
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { Dispatch } from 'redux';
import styles from './WorklistItem.style';
import { setScannedEvent } from '../../state/actions/Global';
import { trackEvent } from '../../utils/AppCenterTool';
import { exceptionTypeToDisplayString } from '../../screens/Worklist/FullExceptionList';
import { TrackEventSource } from '../../models/Generics.d';
import ImageWrapper from '../ImageWrapper/ImageWrapper';
import { strings } from '../../locales';

interface WorklistItemProps {
  exceptionType: string;
  itemDescription: string;
  itemNumber: number;
  navigation: NavigationProp<any>;
  dispatch: Dispatch<any>;
  trackEventSource: TrackEventSource;
  countryCode: string;
  showItemImage: boolean;
  pendingApproval: boolean;
  pendingPick: boolean;
  imageToken?: string | undefined;
  tokenIsWaiting?: boolean;
}

export const WorklistItem = (props: WorklistItemProps): JSX.Element => {
  const {
    navigation, dispatch, exceptionType, itemDescription,
    itemNumber, trackEventSource, countryCode, showItemImage,
    pendingApproval, pendingPick, imageToken, tokenIsWaiting
  } = props;
  const worklistItemOnPress = () => {
    trackEvent(trackEventSource.screen, {
      action: trackEventSource.action,
      ...trackEventSource.otherInfo
    });
    dispatch(setScannedEvent({ type: 'worklist', value: itemNumber.toString() }));
    navigation.navigate('ReviewItemDetails', { screen: 'ReviewItemDetailsHome' });
  };

  return (
    <TouchableOpacity testID="btnCard" style={styles.container} onPress={worklistItemOnPress}>
      {showItemImage && (
      <ImageWrapper
        itemNumber={itemNumber}
        countryCode={countryCode}
        imageStyle={styles.image}
        imageToken={imageToken}
        tokenIsWaiting={tokenIsWaiting}
      />
      )}
      <View style={styles.content}>
        <Text style={styles.exceptionType}>
          { exceptionTypeToDisplayString(exceptionType) }
        </Text>
        <Text style={styles.itemInfo}>
          { itemDescription }
        </Text>
        <Text style={styles.itemNumber}>
          { itemNumber }
        </Text>
        <View style={styles.pendingBadges}>
          {pendingPick && <Text style={styles.pendingPick}>{strings('WORKLIST.PENDING_PICK')}</Text>}
          {pendingApproval && <Text style={styles.pendingApproval}>{strings('WORKLIST.PENDING_APPROVAL')}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

WorklistItem.defaultProps = {
  imageToken: undefined,
  tokenIsWaiting: false
};
