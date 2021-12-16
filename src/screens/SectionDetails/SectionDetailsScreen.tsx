import React, {
  Dispatch, EffectCallback, useEffect, useMemo, useRef, useState
} from 'react';
import {
  ActivityIndicator, Text, TouchableOpacity, View
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { strings } from '../../locales';
import { LocationItem, SectionDetailsItem } from '../../models/LocationItems';
import { deleteLocation, getSectionDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import styles from './SectionDetailsScreen.style';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import FloorItemRow from '../../components/FloorItemRow/FloorItemRow';
import Button from '../../components/buttons/Button';
import { CustomModalComponent } from '../Modal/Modal';
import { DELETE_LOCATION, GET_PALLET_DETAILS, GET_SECTION_DETAILS } from '../../state/actions/asyncAPI';
import {
  hideItemPopup, selectAisle, selectSection, selectZone
} from '../../state/actions/Location';
import { showSnackBar } from '../../state/actions/SnackBar';
import BottomSheetSectionRemoveCard from '../../components/BottomSheetRemoveCard/BottomSheetRemoveCard';
import BottomSheetEditCard from '../../components/BottomSheetEditCard/BottomSheetEditCard';
import { LocationIdName } from '../../state/reducers/Location';

interface SectionDetailsProps {
  getSectionDetailsApi: AsyncState;
  deleteLocationApi: AsyncState;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  trackEventCall: (eventName: string, params?: any) => void;
  useEffectHook: (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
  scannedEvent: { type: string, value: string };
  addAPI: AsyncState;
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: SectionDetailsItem | null;
  selectedSection: LocationIdName;
}

export const handleDeleteItem = (selectedItem: SectionDetailsItem | null, sectionId: number, dispatch: Dispatch<any>): void => {
  if (selectedItem) {
    dispatch(
      deleteLocation({
        headers: { itemNbr: selectedItem.itemNbr },
        upc: selectedItem.upcNbr,
        sectionId,
        locationTypeNbr: selectedItem.locationType
      })
    );
  }
};

export const SectionDetailsScreen = (props: SectionDetailsProps): JSX.Element => {
  const {
    getSectionDetailsApi,
    deleteLocationApi,
    dispatch,
    navigation,
    trackEventCall,
    useEffectHook,
    scannedEvent,
    addAPI,
    displayConfirmation,
    setDisplayConfirmation,
    selectedItem,
    selectedSection
  } = props;

  // Navigation Listener
  useEffectHook(() => {
    // Resets Get SectionDetails api response data when navigating off-screen
    navigation.addListener('beforeRemove', () => {
      dispatch({ type: GET_SECTION_DETAILS.RESET });
    });
  }, []);

  // Get Section Details Api
  useEffectHook(() => {
    // on api success
    if (!getSectionDetailsApi.isWaiting && getSectionDetailsApi.result) {
      // Clear Pallet Data on on success ( Case when scanning a new section, stale data could remain)
      dispatch({ type: GET_PALLET_DETAILS.RESET });
      // Update Location State on Success
      switch (getSectionDetailsApi.result.status) {
        case 200:
        case 207:
          // eslint-disable-next-line no-case-declarations
          const { zone, aisle, section } = getSectionDetailsApi.result.data;
          dispatch(selectZone(zone.id || 0, zone.name || ''));
          dispatch(selectAisle(aisle.id || 0, aisle.name || ''));
          dispatch(selectSection(section.id, section.name));
          break;
        case 204:
          break;
        default: break;
      }
    }
  }, [getSectionDetailsApi]);

  // Delete Location API
  useEffectHook(() => {
    // on api success
    if (!deleteLocationApi.isWaiting && deleteLocationApi.result) {
      setDisplayConfirmation(false);
      dispatch({ type: DELETE_LOCATION.RESET });
      dispatch(getSectionDetails({ sectionId: scannedEvent.value }));
    }

    // on api failure
    if (!deleteLocationApi.isWaiting && deleteLocationApi.error) {
      dispatch(showSnackBar(strings('LOCATION.ERROR_DELETE_ITEM'), 3000));
    }
  }, [deleteLocationApi]);
  const locationItem: LocationItem | undefined = (getSectionDetailsApi.result && getSectionDetailsApi.result.data)
  || undefined;

  if (getSectionDetailsApi.isWaiting) {
    return (
      <ActivityIndicator
        animating={getSectionDetailsApi.isWaiting}
        hidesWhenStopped
        color={COLOR.MAIN_THEME_COLOR}
        size="large"
        style={styles.activityIndicator}
      />
    );
  }

  if (getSectionDetailsApi.error) {
    return (
      <View style={styles.errorView}>
        <MaterialCommunityIcon name="alert" size={40} color={COLOR.RED_300} />
        <Text style={styles.errorText}>{strings('LOCATION.LOCATION_API_ERROR')}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => {
            trackEventCall('location_api_retry',);
            dispatch(getSectionDetails({ sectionId: scannedEvent.value }));
          }}
        >
          <Text>{strings('GENERICS.RETRY')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (getSectionDetailsApi.result?.status === 204) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcon name="information" size={40} color={COLOR.DISABLED_BLUE} />
        <Text>{strings('LOCATION.SECTION_NOT_FOUND')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.locDetailsScreenContainer}>
      <FlatList
        data={locationItem?.items.sectionItems}
        renderItem={({ item }) => (
          <FloorItemRow
            item={item}
            dispatch={dispatch}
            navigation={navigation}
          />
        )}
        keyExtractor={(item, idx) => `${item.itemNbr}${idx}`}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcon name="information" size={40} color={COLOR.DISABLED_BLUE} />
            <Text>{strings('LOCATION.FLOOR_EMPTY')}</Text>
          </View>
        )}
      />
      <CustomModalComponent
        isVisible={displayConfirmation}
        onClose={() => setDisplayConfirmation(false)}
        modalType="Error"
      >
        {deleteLocationApi.isWaiting ? (
          <ActivityIndicator
            animating={deleteLocationApi.isWaiting}
            hidesWhenStopped
            color={COLOR.MAIN_THEME_COLOR}
            size="large"
            style={styles.activityIndicator}
          />
        ) : (
          <>
            <Text style={styles.message}>
              {strings('LOCATION.DELETE_ITEM',
                {
                  itemNbr: selectedItem ? selectedItem.itemNbr : '',
                  itemName: selectedItem ? selectedItem.itemDesc : ''
                })
              }
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
                title={deleteLocationApi.error ? strings('GENERICS.RETRY') : strings('GENERICS.OK')}
                backgroundColor={COLOR.MAIN_THEME_COLOR}
                onPress={() => handleDeleteItem(selectedItem, selectedSection.id, dispatch)}
              />
            </View>
          </>
        )}
      </CustomModalComponent>
    </View>
  );
};

const SectionDetails = (): JSX.Element => {
  const getSectionDetailsApi = useTypedSelector(state => state.async.getSectionDetails);
  const deleteLocationApi = useTypedSelector(state => state.async.deleteLocation);
  const { scannedEvent } = useTypedSelector(state => state.Global);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const addAPI = useTypedSelector(state => state.async.addPallet);
  const { itemPopupVisible, selectedItem, selectedSection } = useTypedSelector(state => state.Location);
  const snapPoints = useMemo(() => ['40%'], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  useEffect(() => {
    if (navigation.isFocused() && bottomSheetModalRef.current) {
      if (itemPopupVisible) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    }
  }, [itemPopupVisible]);
  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={() => dispatch(hideItemPopup())}
        disabled={!itemPopupVisible}
        activeOpacity={1}
        style={itemPopupVisible ? styles.disabledContainer : styles.container}
      >
        <SectionDetailsScreen
          getSectionDetailsApi={getSectionDetailsApi}
          deleteLocationApi={deleteLocationApi}
          addAPI={addAPI}
          dispatch={dispatch}
          navigation={navigation}
          trackEventCall={trackEvent}
          useEffectHook={useEffect}
          scannedEvent={scannedEvent}
          displayConfirmation={displayConfirmation}
          setDisplayConfirmation={setDisplayConfirmation}
          selectedItem={selectedItem}
          selectedSection={selectedSection}
        />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => dispatch(hideItemPopup())}
        style={styles.bottomSheetModal}
      >
        <BottomSheetEditCard
          isVisible={true}
          text={strings('LOCATION.EDIT_ITEM')}
          onPress={() => { }}
        />
        <BottomSheetSectionRemoveCard
          isVisible={true}
          text={strings('LOCATION.REMOVE_ITEM')}
          onPress={() => {
            dispatch(hideItemPopup());
            setDisplayConfirmation(true);
          }}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default SectionDetails;