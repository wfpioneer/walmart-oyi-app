import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import EnterClubNbrForm from './EnterClubNbrForm';

describe('Tests rendering EnterClubNbrForm', () => {
  it('Renders the EnterClubNbrForm', () => {
    const { toJSON } = render(
      <EnterClubNbrForm
        onSignOut={jest.fn}
        onSubmit={jest.fn}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
describe('Tests all button and text change events', () => {
  it('should call respective fn on btn click, on club change set txtClubNbr value', () => {
    const mockSignOut = jest.fn();
    const mockSignIn = jest.fn();
    const { getByTestId } = render(
      <EnterClubNbrForm
        onSignOut={mockSignOut}
        onSubmit={mockSignIn}
      />
    );
    const btnSignOut = getByTestId('btnSignOut');
    const btnSubmit = getByTestId('btnSubmit');
    const txtClubNbr = getByTestId('txtClubNbr');

    fireEvent.press(btnSignOut);
    expect(mockSignOut).toBeCalledTimes(1);

    expect(btnSubmit.props.accessibilityState.disabled).toBe(true);

    fireEvent.changeText(txtClubNbr, '1234');
    expect(txtClubNbr.props.value).toBe('1234');

    expect(btnSubmit.props.accessibilityState.disabled).toBe(false);
    fireEvent.press(btnSubmit);
    expect(mockSignIn).toBeCalledTimes(1);
  });

  it('should disable submit btn on invalid club no', () => {
    const { getByTestId } = render(
      <EnterClubNbrForm
        onSignOut={jest.fn}
        onSubmit={jest.fn}
      />
    );
    const btnSubmit = getByTestId('btnSubmit');
    const txtClubNbr = getByTestId('txtClubNbr');

    fireEvent.changeText(txtClubNbr, '9999999');
    expect(btnSubmit.props.accessibilityState.disabled).toBe(true);
  });
});
