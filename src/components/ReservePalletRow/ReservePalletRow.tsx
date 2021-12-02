import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import styles from './ReservePalletRow.style';
import { strings } from '../../locales';
import { SectionDetailsPallet } from '../../models/LocationItems';
import { CustomModalComponent } from '../../screens/Modal/Modal';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';
import { deletePallet, getSectionDetails } from '../../state/actions/saga';
import { GET_SECTION_DETAILS } from '../../state/actions/asyncAPI';
import { LocationIdName } from '../../state/reducers/Location';

export type ReservePalletRowProps = { section: LocationIdName, reservePallet: SectionDetailsPallet };
const ReservePalletRow = (props: ReservePalletRowProps): JSX.Element => {
  const { section, reservePallet } = props;
  const dispatch = useDispatch();
  const userFeatures = useTypedSelector(state => state.User.features);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const delPalletAPI = useTypedSelector(state => state.async.deletePallet);
  const deletePalletConfirmation = () => {
    setDisplayConfirmation(true);
  };
  useEffect(() => {
    // on api success
    if (!delPalletAPI.isWaiting && delPalletAPI.result && displayConfirmation) {
      setDisplayConfirmation(false);
      dispatch(getSectionDetails({ sectionId: section.id.toString() }));
      dispatch({ type: 'API/DELETE_PALLET/RESET' });
    }
  }, [delPalletAPI]);

  const deleteConfirmed = () => {
    dispatch(deletePallet({
      palletId: reservePallet.palletId
    }));
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pallet}>
          <Text style={styles.textHeader}>
            {`${strings('LOCATION.PALLET')} ${reservePallet.palletId}`}
          </Text>
          { userFeatures.includes('location management edit') && (
            <TouchableOpacity onPress={() => deletePalletConfirmation()}>
              <View>
                <Image
                  source={require('../../assets/images/trash_can.png')}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.palletCreateTs}>
          {`${strings('LOCATION.CREATED_ON')} ${reservePallet.palletCreateTS}`}
        </Text>
        { reservePallet.items && reservePallet.items.length > 0 && (
        <View style={styles.itemContainer}>
          <Text style={styles.itemNbr}>
            {`${strings('ITEM.ITEM')} ${reservePallet.items[0]?.itemNbr}`}
          </Text>
          <Text>
            {reservePallet.items[0].itemDesc}
          </Text>
          { reservePallet.items.length > 1
              && (
              <Text style={styles.moreText}>
                {`+${reservePallet.items.length - 1} ${strings('LOCATION.MORE')}`}
              </Text>
              )}
        </View>
        )}
      </View>
      <CustomModalComponent
        isVisible={displayConfirmation}
        onClose={() => setDisplayConfirmation(false)}
        modalType="Error"
      >
        {delPalletAPI.isWaiting ? (
          <ActivityIndicator
            animating={delPalletAPI.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />
        ) : (
          <>
            <Text style={styles.message}>
              {`${strings('LOCATION.PALLET_DELETE_CONFIRMATION')}${reservePallet.palletId}`}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.delButton}
                title={strings('GENERICS.CANCEL')}
                backgroundColor={COLOR.TRACKER_RED}
                onPress={() => setDisplayConfirmation(false)}
              />
              <Button
                style={styles.delButton}
                title={delPalletAPI.error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
                backgroundColor={COLOR.MAIN_THEME_COLOR}
                onPress={deleteConfirmed}
              />
            </View>
          </>
        )}
      </CustomModalComponent>
    </View>
  );
};

export default ReservePalletRow;
