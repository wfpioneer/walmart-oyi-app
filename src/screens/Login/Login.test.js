import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LoginScreen } from './Login';

const navigationProp = {
  addListener: jest.fn(),
  navigate: jest.fn()
};

describe('LoginScreen', () => {
  it('renders the snapshot test appropriately', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<LoginScreen loginUser={jest.fn} navigation={navigationProp} hideModal={jest.fn} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('SignInUser', () => {
  it('calls WMSSO then navigates to the home screen', async () => {
    const loginUserMock = jest.fn();
    const navigationMock = {
      navigate: jest.fn()
    };
    const hideModalMock = jest.fn();

    const loginScreen = new LoginScreen({
      loginUser: loginUserMock,
      navigation: navigationMock,
      hideModal: hideModalMock
    });

    await loginScreen.signInUser();
    expect(loginUserMock).toHaveBeenCalled();
    expect(navigationMock.navigate).toHaveBeenCalled();
    expect(hideModalMock).toHaveBeenCalled();
  });
});

describe('ComponentDidMount', () => {
  it('sets up the navigation event listener and calls signInUser', () => {
    const navigationMock = {
      addListener: jest.fn()
    };
    const loginScreen = new LoginScreen({
      navigation: navigationMock
    });
    loginScreen.signInUser = jest.fn();
    loginScreen.componentDidMount();
    expect(loginScreen.signInUser).toHaveBeenCalled();
    expect(navigationMock.addListener).toHaveBeenCalled();
  });
});

describe('ComponentWillUnmount', () => {
  it('does nothing if the unsubscribe function doesnt exist', () => {
    const loginScreen = new LoginScreen();
    expect(loginScreen.componentWillUnmount()).toBeUndefined();
  });

  it('calls the unsubscribe function if it does exist', () => {
    const loginScreen = new LoginScreen();
    loginScreen.unsubscribe = jest.fn();
    loginScreen.componentWillUnmount();
    expect(loginScreen.unsubscribe).toHaveBeenCalled();
  })
});
