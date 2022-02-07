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
import { LocationItem, SectionDetailsItem, SectionDetailsPallet } from '../../models/LocationItems';
import { deleteLocation, getPalletDetails, getSectionDetails } from '../../state/actions/saga';
import { AsyncState } from '../../models/AsyncState';
import styles from './SectionDetailsScreen.style';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import FloorItemRow from '../../components/FloorItemRow/FloorItemRow';
import Button from '../../components/buttons/Button';
import { CustomModalComponent } from '../Modal/Modal';
import { DELETE_LOCATION, GET_PALLET_DETAILS, GET_SECTION_DETAILS } from '../../state/actions/asyncAPI';
import {
  hideItemPopup, selectAisle, selectSection, selectZone, setPalletIds
} from '../../state/actions/Location';
import { setSelectedLocation, setupScreen } from '../../state/actions/ItemDetailScreen';
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
  displayConfirmation: boolean;
  setDisplayConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: SectionDetailsItem | null;
  selectedSection: LocationIdName;
}

export const handleDeleteItem = (
  selectedItem: SectionDetailsItem | null,
  sectionId: number,
  dispatch: Dispatch<any>
): void => {
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

export const handleEditItem = (
  selectedItem: SectionDetailsItem | null,
  dispatch: Dispatch<any>,
  navigation: NavigationProp<any>,
  selectedZone: LocationIdName,
  selectedAisle: LocationIdName,
  selectedSection: LocationIdName
): void => {
  const currentSection = {
    zoneId: selectedZone.id,
    aisleId: selectedAisle.id,
    sectionId: selectedSection.id,
    zoneName: selectedZone.name,
    aisleName: selectedAisle.name,
    sectionName: selectedSection.name,
    locationName: `${selectedZone.name}${selectedAisle.name}-${selectedSection.name}`,
    type: '8',
    typeNbr: 8
  };
  dispatch(setupScreen(
    selectedItem ? selectedItem.itemNbr : 0,
    selectedItem ? selectedItem.upcNbr : '',
    [currentSection],
    [],
    null,
    -999,
    false,
    false
  ));
  dispatch(setSelectedLocation(currentSection));
  dispatch(hideItemPopup());
  navigation.navigate('EditLocation');
};

export const palletDataToIds = (palletData: SectionDetailsPallet[]): number[] => {
  let palletIds = [];
  palletIds = palletData.map(
    (item: Omit<SectionDetailsPallet, 'items'>) => item.palletId
  );
  return palletIds;
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
    displayConfirmation,
    setDisplayConfirmation,
    selectedItem,
    selectedSection
  } = props;

  // Navigation Listener
  // Resets Get SectionDetails api response data when navigating off-screen
  useEffectHook(() => navigation.addListener('beforeRemove', () => {
    dispatch(hideItemPopup());
    dispatch({ type: GET_SECTION_DETAILS.RESET });
  }), []);

  // Get Section Details Api
  useEffectHook(() => {
    // on api success
    if (!getSectionDetailsApi.isWaiting && getSectionDetailsApi.result) {
      // Clear Pallet Data on on success ( Case for when scanning a new section, stale data could remain)
      dispatch({ type: GET_PALLET_DETAILS.RESET });
      // Update Location State on Success
      if (getSectionDetailsApi.result.status !== 204) {
        const {
          pallets, zone, aisle, section
        } = getSectionDetailsApi.result.data;
        const palletIdList = palletDataToIds(pallets.palletData);
        dispatch(selectZone(zone.id, zone.name));
        dispatch(selectAisle(aisle.id, aisle.name));
        dispatch(selectSection(section.id, section.name));
        dispatch(setPalletIds(palletIdList));
        if (palletIdList.length !== 0) {
          dispatch(getPalletDetails({ palletIds: palletIdList }));
        }
      }
    }

    if (!getSectionDetailsApi.isWaiting && getSectionDetailsApi.error) {
      if (!navigation.isFocused()) {
        navigation.navigate('FloorDetails');
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
                })}
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
  const {
    itemPopupVisible,
    selectedItem,
    selectedZone,
    selectedAisle,
    selectedSection
  } = useTypedSelector(state => state.Location);
  const snapPoints = useMemo(() => ['40%'], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  useEffect(() => {
    if (bottomSheetModalRef.current) {
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
          onPress={() => {
            handleEditItem(selectedItem, dispatch, navigation, selectedZone, selectedAisle, selectedSection);
          }}
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
