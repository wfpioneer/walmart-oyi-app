import React, {
  EffectCallback, useEffect, useState
} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { strings } from '../../locales';
import { AsyncState } from '../../models/AsyncState';
import COLOR from '../../themes/Color';
import styles from './SettingsTool.style';
import Button, { ButtonType } from '../../components/buttons/Button';
import { assignFluffyFeatures, setConfigs } from '../../state/actions/User';
import { getClubConfig, getFluffyFeatures } from '../../state/actions/saga';
import { useTypedSelector } from '../../state/reducers/RootReducer';
import { Printer, PrintingType } from '../../models/Printer';
import { setPrintingType } from '../../state/actions/Print';
import User, { Configurations } from '../../models/User';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { GET_CLUB_CONFIG, GET_FLUFFY_ROLES } from '../../state/actions/asyncAPI';

interface SettingsToolProps {
  printerOpen: boolean;
  togglePrinterList: React.Dispatch<React.SetStateAction<boolean>>;
  featuresOpen: boolean;
  toggleFeaturesList: React.Dispatch<React.SetStateAction<boolean>>;
  priceLabelPrinter: Printer | null;
  locationLabelPrinter: Printer | null;
  palletLabelPrinter: Printer | null;
  userFeatures: string[];
  userConfigs: Configurations;
  dispatch: Dispatch<any>;
  navigation: NavigationProp<any>;
  getClubConfigApiState: AsyncState;
  getFluffyApiState: AsyncState;
  user: User;
  useEffectHook: (effect: EffectCallback, deps?:ReadonlyArray<any>) => void;
}

const resetApis = (dispatch: Dispatch<any>) => {
  dispatch({ type: GET_CLUB_CONFIG.RESET });
  dispatch({ type: GET_FLUFFY_ROLES.RESET });
};

export const getConfigAndFluffyFeaturesApiHook = (
  getClubConfigApiState: AsyncState,
  getFluffyApiState: AsyncState,
  navigation: NavigationProp<any>,
  dispatch: Dispatch<any>,
) => {
  if (navigation.isFocused()) {
    // on api request
    if (getClubConfigApiState.isWaiting || getFluffyApiState.isWaiting) {
      dispatch(showActivityModal());
    } else {
      dispatch(hideActivityModal());
    }
    // on getClubConfig api success
    if (!getClubConfigApiState.isWaiting && getClubConfigApiState.result) {
      if (getClubConfigApiState.result.status === 200) {
        const {
          data
        } = getClubConfigApiState.result;
        dispatch(setConfigs(data));
      }
    }
    // on getFluffyFeatures api success
    if (!getFluffyApiState.isWaiting && getFluffyApiState.result) {
      if (getFluffyApiState.result.status === 200) {
        const {
          data
        } = getFluffyApiState.result;
        dispatch(assignFluffyFeatures(data));
      }
    }
    if (getClubConfigApiState.result && getFluffyApiState.result) {
      Toast.show({
        type: 'success',
        text1: strings('SETTINGS.FEATURE_UPDATE_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      resetApis(dispatch);
    } else if (getClubConfigApiState.error || getFluffyApiState.error) {
      Toast.show({
        type: 'error',
        text1: strings('SETTINGS.FEATURE_UPDATE_FAILURE'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      resetApis(dispatch);
    }
  }
};
interface CollapsibleCardProps {
  title: string;
  isOpened: boolean;
  toggleIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}
export const featureCard = (featureName: string, isEnabled: boolean): JSX.Element => (
  <View style={styles.featureCardContainer}>
    <Text style={styles.featureText}>{featureName}</Text>
    <Text style={styles.featureText}>{isEnabled ? strings('GENERICS.ENABLED') : strings('GENERICS.DISABLED')}</Text>
  </View>
);
export const printerCard = (printerTitle: string, printer: Printer | null, changePrinter: () => void): JSX.Element => (
  <View style={styles.printCardContainer}>
    <View>
      <Text style={styles.printCardText}>{printerTitle}</Text>
      <Text>
        {'  '}
        {printer?.name ?? strings('GENERICS.NOT_ASSIGNED')}
      </Text>
    </View>
    <TouchableOpacity style={styles.changeContainer} onPress={changePrinter}>
      <Text style={styles.changeText}>{strings('GENERICS.CHANGE')}</Text>
    </TouchableOpacity>
  </View>
);

export const CollapsibleCard = (props: CollapsibleCardProps): JSX.Element => {
  const { title, isOpened, toggleIsOpened } = props;
  const iconName = isOpened ? 'keyboard-arrow-up' : 'keyboard-arrow-down';

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{ title }</Text>
      </View>
      <TouchableOpacity style={styles.arrowView} onPress={() => toggleIsOpened(!isOpened)}>
        <MaterialIcons name={iconName} size={25} color={COLOR.GREY_700} />
      </TouchableOpacity>
    </>
  );
};

export const SettingsToolScreen = (props: SettingsToolProps): JSX.Element => {
  const {
    featuresOpen, printerOpen, toggleFeaturesList, togglePrinterList,
    locationLabelPrinter, palletLabelPrinter, priceLabelPrinter,
    userFeatures, userConfigs, dispatch, navigation, user, getClubConfigApiState,
    getFluffyApiState, useEffectHook
  } = props;

  useEffectHook(() => getConfigAndFluffyFeaturesApiHook(
    getClubConfigApiState,
    getFluffyApiState,
    navigation,
    dispatch,
  ), [getClubConfigApiState, getFluffyApiState]);

  const changePrinter = (printerType: PrintingType) => {
    dispatch(setPrintingType(printerType));
    navigation.navigate('PrintPriceSign', { screen: 'PrinterList' });
  };

  const onSubmit = () => {
    dispatch(getFluffyFeatures(user));
    dispatch(getClubConfig());
  };

  const appFeatures: Array<{fluffyKey: string, configKey: string, name:string}> = [
    {
      fluffyKey: 'manager approval',
      configKey: 'managerApproval',
      name: strings('APPROVAL.MANAGER_APPROVAL')
    },
    {
      fluffyKey: 'location management',
      configKey: 'locationManagement',
      name: strings('LOCATION.LOCATION_MANAGEMENT')
    },
    {
      fluffyKey: 'on hands change',
      configKey: 'onHandsChange',
      name: strings('APPROVAL.OH_CHANGE')
    },
    {
      fluffyKey: 'location management edit',
      configKey: 'locationManagementEdit',
      name: strings('LOCATION.LOCATION_MGMT_EDIT')
    },
    {
      fluffyKey: 'location printing',
      configKey: 'locationPrinting',
      name: strings('PRINT.LOCATION_PRINTING')
    },
    {
      fluffyKey: 'pallet management',
      configKey: 'palletManagement',
      name: strings('LOCATION.PALLET_MANAGEMENT')
    },
    {
      fluffyKey: 'picking',
      configKey: 'picking',
      name: strings('PICKING.PICKING')
    },
    {
      fluffyKey: 'binning',
      configKey: 'binning',
      name: strings('BINNING.BINNING')
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.menuContainer}>
          <CollapsibleCard
            title={strings('PRINT.CHANGE_TITLE')}
            isOpened={printerOpen}
            toggleIsOpened={togglePrinterList}
          />
        </View>
        {printerOpen && (printerCard(
          strings('PRINT.PRICE_SIGN_PRINTER'),
          priceLabelPrinter,
          () => changePrinter(PrintingType.PRICE_SIGN)
        ))}
        {printerOpen && (printerCard(
          strings('PRINT.LOCATION_LABEL_PRINTER'),
          locationLabelPrinter,
          () => changePrinter(PrintingType.LOCATION)
        ))}
        {printerOpen && (printerCard(
          strings('PRINT.PALLET_LABEL_PRINTER'),
          palletLabelPrinter,
          () => changePrinter(PrintingType.PALLET)
        ))}
        <View style={styles.menuContainer}>
          <CollapsibleCard
            title={strings('SETTINGS.FEATURES')}
            isOpened={featuresOpen}
            toggleIsOpened={toggleFeaturesList}
          />
        </View>
        {featuresOpen && (
        <FlatList
          data={appFeatures}
          renderItem={({ item }) => featureCard(
            item.name,
            userFeatures.some(feature => feature === item.fluffyKey)
            || Boolean(userConfigs[item.configKey as keyof Configurations])
          )}
          keyExtractor={item => item.name}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={styles.footer}
        />
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title={strings('GENERICS.UPDATE')}
          type={ButtonType.PRIMARY}
          onPress={onSubmit}
          testID="updateButton"
        />
      </View>
    </View>
  );
};
const SettingsTool = (): JSX.Element => {
  const [printerOpen, togglePrinterView] = useState(true);
  const [featuresOpen, toggleFeatureList] = useState(true);
  const getClubConfigApiState = useTypedSelector(state => state.async.getClubConfig);
  const getFluffyApiState = useTypedSelector(state => state.async.getFluffyRoles);
  const { priceLabelPrinter, locationLabelPrinter, palletLabelPrinter } = useTypedSelector(state => state.Print);
  const user = useTypedSelector(state => state.User);
  const userFeatures = useTypedSelector(state => state.User.features);
  const userConfiguration = useTypedSelector(state => state.User.configs);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <SettingsToolScreen
      printerOpen={printerOpen}
      togglePrinterList={togglePrinterView}
      featuresOpen={featuresOpen}
      toggleFeaturesList={toggleFeatureList}
      priceLabelPrinter={priceLabelPrinter}
      locationLabelPrinter={locationLabelPrinter}
      palletLabelPrinter={palletLabelPrinter}
      user={user}
      userFeatures={userFeatures}
      userConfigs={userConfiguration}
      dispatch={dispatch}
      navigation={navigation}
      getClubConfigApiState={getClubConfigApiState}
      getFluffyApiState={getFluffyApiState}
      useEffectHook={useEffect}
    />
  );
};

export default SettingsTool;
