import React from 'react';
import {
  Text, View
} from 'react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import store from '../../state';
import {
  ActivityModalComponent, CustomModalComponent
} from './Modal';
import {
  HIDE_INFO_MODAL, hideActivityModal, hideInfoModal, showActivityModal, showInfoModal
} from '../../state/actions/Modal';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn().mockImplementation(() => { }),
    useDispatch: () => mockDispatch
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('ActivityModalComponent', () => {
  it('show when show activity is set to false', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <ActivityModalComponent />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('show activity loader when show activity is set to true', () => {
    const renderer = ShallowRenderer.createRenderer();
    store.dispatch(showActivityModal());
    renderer.render(
      <Provider store={store}>
        <ActivityModalComponent />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('show content modal when show info modal is true also on btnOk action call dispatch', () => {
    store.dispatch(hideActivityModal());
    store.dispatch(showInfoModal('title', 'content'));
    const { toJSON, getByTestId } = render(
      <Provider store={store}>
        <ActivityModalComponent />
      </Provider>
    );

    expect(toJSON()).toMatchSnapshot();

    const modalCancelButton = getByTestId('btnOk');
    fireEvent.press(modalCancelButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: HIDE_INFO_MODAL });
  });

  it('should hide info modal when show info modal is set to false', () => {
    const renderer = ShallowRenderer.createRenderer();
    store.dispatch(hideInfoModal());
    renderer.render(
      <Provider store={store}>
        <ActivityModalComponent />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test CustomModalComponent Component', () => {
  it('should render component visible set to true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CustomModalComponent
        animationType="none"
        isVisible={true}
        modalType="Form"
        onClose={jest.fn()}
        minHeight={10}
      >
        <View>
          <Text>Test Component</Text>
        </View>
      </CustomModalComponent>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should render component visible set to true and modalType as error', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CustomModalComponent
        animationType="none"
        isVisible={true}
        modalType="Error"
        onClose={jest.fn()}
        minHeight={10}
      >
        <View>
          <Text>Test Component</Text>
        </View>
      </CustomModalComponent>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should render component visible set to true and modalType as popup', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CustomModalComponent
        animationType="none"
        isVisible={true}
        modalType="Popup"
        onClose={jest.fn()}
        minHeight={10}
      >
        <View>
          <Text>Test Component</Text>
        </View>
      </CustomModalComponent>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should render component visible set to true and modalType as FormHeader', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CustomModalComponent
        animationType="none"
        isVisible={true}
        modalType="FormHeader"
        onClose={jest.fn()}
        minHeight={10}
      >
        <View>
          <Text>Test Component</Text>
        </View>
      </CustomModalComponent>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should render component when visible set to false', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CustomModalComponent
        animationType="none"
        isVisible={false}
        modalType="Form"
        onClose={jest.fn()}
        minHeight={10}
      >
        <View>
          <Text>Test Component</Text>
        </View>
      </CustomModalComponent>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
