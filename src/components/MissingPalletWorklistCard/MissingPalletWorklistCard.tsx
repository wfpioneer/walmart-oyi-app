import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import styles from './MissingPalletWorklistCard.style';

interface MissingPalletWorklistCardProps {
 palletId: number;
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
    <TouchableOpacity testID="missingPalletWorklistCard" style={styles.container} onPress={navigateCallback}>
      <View>
        <Text style={styles.exceptionType}>{strings('MISSING_PALLET_WORKLIST.MISSING_PALLET_LABEL')}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.wrapperContainer}>
          <Text style={styles.contentText}>
            {`${strings('MISSING_PALLET_WORKLIST.PALLET_ID')}: ${palletId}`}
          </Text>
          <Text style={styles.contentText}>
            {`${strings('MISSING_PALLET_WORKLIST.REPORTED_DATE')}: ${moment(reportedDate).format('DD/MM/YYYY')}`}
          </Text>
        </View>
        <View style={styles.wrapperContainer}>
          <Text style={styles.contentText}>
            {`${strings('MISSING_PALLET_WORKLIST.LAST_LOCATION')}: ${lastLocation}`}
          </Text>
          <Text style={styles.contentText}>
            {`${strings('MISSING_PALLET_WORKLIST.REPORTED_BY')}: ${reportedBy}`}
          </Text>
        </View>
        {expanded
          && (
          <View style={styles.iconView}>
            <MaterialIcons testID="navigate-next-icon" name="navigate-next" size={40} color={COLOR.BLACK} />
          </View>
          )}
      </View>
      { expanded
          && (
            <View style={styles.palletActionContainer}>
              <Button
                testID="addLocationButton"
                style={styles.actionButton}
                title={strings('MISSING_PALLET_WORKLIST.ADD_LOCATION')}
                backgroundColor={COLOR.MAIN_THEME_COLOR}
                onPress={addCallback}
              />
              <Button
                testID="deletePalletButton"
                style={styles.actionButton}
                title={strings('MISSING_PALLET_WORKLIST.DELETE_PALLET')}
                backgroundColor={COLOR.TRACKER_RED}
                onPress={deleteCallback}
              />
            </View>
          )}
    </TouchableOpacity>
  );
};

export default MissingPalletWorklistCard;
