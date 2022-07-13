import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { fireEvent, render } from '@testing-library/react-native';
import {
  CollapsibleCard, SettingsToolScreen, featureCard, getConfigAndFluffyFeaturesApiHook, printerCard
} from './SettingsTool';
import { mockPrinterList } from '../../mockData/mockPrinterList';
import { Configurations } from '../../models/User';
import { mockConfig } from '../../mockData/mockConfig';
import mockUser from '../../mockData/mockUser';
import { strings } from '../../locales';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

describe('SettingsToolScreen', () => {
  const testConfigs: Configurations = {
    ...mockConfig,
    locationManagement: true,
    locationManagementEdit: true,
    settingsTool: true,
    palletManagement: true,
    binning: true,
    picking: true,
    printingUpdate: true
  };
  const navigationProp: NavigationProp<any> = {
    addListener: jest.fn(),
    canGoBack: jest.fn(),
    dangerouslyGetParent: jest.fn(),
    dangerouslyGetState: jest.fn(),
    dispatch: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(() => true),
    removeListener: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
    setParams: jest.fn(),
    navigate: jest.fn()
  };

  const defaultAsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  describe('Tests rendering the SettingsToolScreen component', () => {
    it('Test renders the default SettingsToolScreen ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsToolScreen
          printerOpen={true}
          togglePrinterList={jest.fn()}
          featuresOpen={true}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={null}
          locationLabelPrinter={null}
          palletLabelPrinter={null}
          userFeatures={[]}
          userConfigs={testConfigs}
          dispatch={jest.fn()}
          navigation={navigationProp}
          getClubConfigApiState={defaultAsyncState}
          getFluffyApiState={defaultAsyncState}
          useEffectHook={jest.fn}
          user={mockUser}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the SettingsToolScreen with Selected Printers', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsToolScreen
          printerOpen={true}
          togglePrinterList={jest.fn()}
          featuresOpen={true}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={mockPrinterList[0]}
          locationLabelPrinter={mockPrinterList[1]}
          palletLabelPrinter={mockPrinterList[2]}
          userFeatures={[]}
          userConfigs={testConfigs}
          dispatch={jest.fn()}
          navigation={navigationProp}
          getClubConfigApiState={defaultAsyncState}
          getFluffyApiState={defaultAsyncState}
          useEffectHook={jest.fn}
          user={mockUser}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the SettingsToolScreen with the Printer List collapsed', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsToolScreen
          printerOpen={false}
          togglePrinterList={jest.fn()}
          featuresOpen={true}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={null}
          locationLabelPrinter={null}
          palletLabelPrinter={null}
          userFeatures={[]}
          userConfigs={testConfigs}
          dispatch={jest.fn()}
          navigation={navigationProp}
          getClubConfigApiState={defaultAsyncState}
          getFluffyApiState={defaultAsyncState}
          useEffectHook={jest.fn}
          user={mockUser}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the SettingsToolScreen with the Feature List collapsed', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsToolScreen
          printerOpen={true}
          togglePrinterList={jest.fn()}
          featuresOpen={false}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={null}
          locationLabelPrinter={null}
          palletLabelPrinter={null}
          userFeatures={[]}
          userConfigs={testConfigs}
          dispatch={jest.fn()}
          navigation={navigationProp}
          getClubConfigApiState={defaultAsyncState}
          getFluffyApiState={defaultAsyncState}
          useEffectHook={jest.fn}
          user={mockUser}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Tests functionality of update button in settings tool screen', () => {
      const mockDispatch = jest.fn();
      const { getByTestId } = render(
        <SettingsToolScreen
          printerOpen={true}
          togglePrinterList={jest.fn()}
          featuresOpen={false}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={null}
          locationLabelPrinter={null}
          palletLabelPrinter={null}
          userFeatures={[]}
          userConfigs={testConfigs}
          dispatch={mockDispatch}
          navigation={navigationProp}
          getClubConfigApiState={defaultAsyncState}
          getFluffyApiState={defaultAsyncState}
          useEffectHook={jest.fn}
          user={mockUser}
        />
      );
      const updateButton = getByTestId('updateButton');
      fireEvent.press(updateButton);
      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Tests rendering featureCard component', () => {
    const renderer = ShallowRenderer.createRenderer();
    it('featureCard function renders "Enabled" translation if isEnabled is set to True', () => {
      renderer.render(
        featureCard('manager approval', true)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('featureCard function renders "Disabled" translation if isEnabled is set to False', () => {
      renderer.render(
        featureCard('manager approval', false)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering printerCard component', () => {
    const renderer = ShallowRenderer.createRenderer();

    it('printerCard functions renders Printer Name if Printer is not null', () => {
      renderer.render(printerCard('Price Sign Printer', mockPrinterList[0], jest.fn()));
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('printerCard functions renders "Not Assigned" translation if Printer is null', () => {
      renderer.render(printerCard('Price Sign Printer', null, jest.fn()));
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering CollapsibleCard component', () => {
    const renderer = ShallowRenderer.createRenderer();

    it('CollapsibleCard functions renders down-arrow  if isOpened is false', () => {
      renderer.render(
        <CollapsibleCard
          title=""
          isOpened={false}
          toggleIsOpened={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('CollapsibleCard functions renders up-arrow  if isOpened is true', () => {
      renderer.render(
        <CollapsibleCard
          title=""
          isOpened={true}
          toggleIsOpened={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('test externalized functions', () => {
    const mockDispatch = jest.fn();
    const successApi = {
      ...defaultAsyncState,
      result: {
        data: 'test',
        status: 200
      }
    };
    const loadingApiState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    const errorApi = {
      ...defaultAsyncState,
      error: 'testError'
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('test getConfigAndFluffyFeaturesApiHook with success response', () => {
      getConfigAndFluffyFeaturesApiHook(successApi, successApi, navigationProp, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('SETTINGS.FEATURE_UPDATE_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });
    it('test getConfigAndFluffyFeaturesApiHook with error response', () => {
      getConfigAndFluffyFeaturesApiHook(errorApi, errorApi, navigationProp, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('SETTINGS.FEATURE_UPDATE_FAILURE'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });
    it('test getConfigAndFluffyFeaturesApiHook during API request', () => {
      getConfigAndFluffyFeaturesApiHook(loadingApiState, loadingApiState, navigationProp, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
      expect(Toast.show).not.toBeCalled();
    });
  });
});
