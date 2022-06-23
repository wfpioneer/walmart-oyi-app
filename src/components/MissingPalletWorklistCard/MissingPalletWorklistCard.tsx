import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import styles from './MissingPalletWorklistCard.style';

interface MissingPalletWorklistCardProps {
 palletId: string;
 reportedDate: string;
 lastLocation: string;
 reportedBy: string;
 expanded: boolean;
 addCallback: () => void;
 deleteCallback: () => void;
 navigateCallback: () => void;
}

const MissingPalletWorklistCard = (props: MissingPalletWorklistCardProps) => {
  const {
    palletId, reportedDate, lastLocation, reportedBy, expanded, addCallback, deleteCallback, navigateCallback
  } = props;

  return (
    <TouchableOpacity style={styles.container} onPress={navigateCallback}>
      <View style={styles.headerContainer}>
        <Text style={styles.exceptionType}>{strings('MISSING_PALLET_WORKLIST.MISSING_PALLET_LABEL')}</Text>
      </View>
      <View style={styles.wrapperContainer}>
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.contentText}>
              {`${strings('MISSING_PALLET_WORKLIST.PALLET_ID')}: ${palletId}`}
            </Text>
            <Text style={styles.contentText}>
              {`${strings('MISSING_PALLET_WORKLIST.LAST_LOCATION')}: ${lastLocation}`}
            </Text>
            <Text style={styles.contentText}>
              {`${strings('MISSING_PALLET_WORKLIST.REPORTED_DATE')}: ${reportedDate}`}
            </Text>
            <Text style={styles.contentText}>
              {`${strings('MISSING_PALLET_WORKLIST.REPORTED_BY')}: ${reportedBy}`}
            </Text>
          </View>
          {expanded
          && (
          <View style={styles.arrowIcon}>
            <MaterialCommunityIcon name="chevron-right" size={20} color={COLOR.TIP_BLUE} />
          </View>
          )}
        </View>
        { expanded
          && (
            <View style={styles.palletActionContainer}>
              <Button
                style={styles.actionButton}
                title={strings('MISSING_PALLET_WORKLIST.ADD_LOCATION')}
                backgroundColor={COLOR.MAIN_THEME_COLOR}
                onPress={addCallback}
              />
              <Button
                style={styles.actionButton}
                title={strings('MISSING_PALLET_WORKLIST.DELETE_PALLET')}
                backgroundColor={COLOR.TRACKER_RED}
                onPress={deleteCallback}
              />
            </View>
          )}
      </View>
    </TouchableOpacity>
  );
};

export default MissingPalletWorklistCard;
