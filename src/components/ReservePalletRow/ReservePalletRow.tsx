import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  deletePallet,
  getPalletDetails, getSectionDetails
} from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import styles from './ReservePalletRow.style';
import { strings } from '../../locales';
import { ReserveDetailsPallet } from '../../models/LocationItems';
import { CustomModalComponent } from '../../screens/Modal/Modal';
import COLOR from '../../themes/Color';
import Button from '../buttons/Button';

export type ReservePalletRowProps = {
  section: { id: number, name: string },
  reservePallet: ReserveDetailsPallet,
  setPalletClicked: React.Dispatch<React.SetStateAction<boolean>>;
};
const ReservePalletRow = (props: ReservePalletRowProps): JSX.Element => {
  const { section, reservePallet, setPalletClicked } = props;
  const dispatch = useDispatch();
  const user = useTypedSelector(state => state.User);
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
      palletId: reservePallet.id
    }));
  };
  const onPalletClick = () => {
    setPalletClicked(true);
    dispatch(getPalletDetails({ palletIds: [reservePallet.id.toString()], isAllItems: true }));
  };
  const createdDate = moment(reservePallet.palletCreateTS).format('YYYY-MM-DD');

  const locationManagementEdit = () => user.features.includes('location management edit')
    || user.configs.locationManagementEdit;

  // TODO Map Pallet and Reserve Response and pass the array into this Component
  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="reserve-pallet-row"
        style={styles.content}
        onPress={onPalletClick}
      >
        <View style={styles.pallet}>
          <Text style={styles.textHeader}>
            {`${strings('LOCATION.PALLET')} ${reservePallet.id}`}
          </Text>
          { locationManagementEdit() && (
            <TouchableOpacity onPress={() => deletePalletConfirmation()}>
              <View>
                <MaterialCommunityIcons name="trash-can" size={40} color={COLOR.TRACKER_GREY} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.palletCreateTs}>
          {`${strings('LOCATION.CREATED_ON')} ${createdDate}`}
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
      </TouchableOpacity>
      <CustomModalComponent
        isVisible={displayConfirmation}
        onClose={() => setDisplayConfirmation(false)}
        modalType="Error"
        minHeight={150}
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
              {`${strings('LOCATION.PALLET_DELETE_CONFIRMATION', {
                pallet: reservePallet.id.toString(),
                section: section.name
              })}`}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.delButton}
                title={strings('GENERICS.CANCEL')}
                backgroundColor={COLOR.MAIN_THEME_COLOR}
                onPress={() => setDisplayConfirmation(false)}
              />
              <Button
                style={styles.delButton}
                title={delPalletAPI.error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
                backgroundColor={COLOR.TRACKER_RED}
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
