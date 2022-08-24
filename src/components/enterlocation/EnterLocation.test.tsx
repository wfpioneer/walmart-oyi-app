import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import EnterLocation from './EnterLocation';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('Tests rendering EnterLocation:', () => {
  it('Renders an EnterLocation with mock fnction', () => {
    const { toJSON } = render(
      <EnterLocation
        setEnterLocation={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('EnterLocation Component', () => {
  it('should set input value on location text input change and enable the submit btn', async () => {
    const { getByTestId } = render(
      <EnterLocation
        setEnterLocation={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    const btnSubmit = getByTestId('btnLocationSubmit');
    expect(btnSubmit.props.accessibilityState.disabled).toBe(true);

    const txtLocation = getByTestId('txtLocation');
    fireEvent.changeText(txtLocation, 'A1-1');
    expect(txtLocation.props.value).toBe('A1-1');
    expect(btnSubmit.props.accessibilityState.disabled).toBe(false);
  });

  it('should submit value on submit click', async () => {
    const mockSubmitLoc = jest.fn();
    const { getByTestId } = render(
      <EnterLocation
        setEnterLocation={jest.fn()}
        onSubmit={mockSubmitLoc}
      />
    );
    const btnSubmit = getByTestId('btnLocationSubmit');
    const txtLocation = getByTestId('txtLocation');
    fireEvent.changeText(txtLocation, 'B1-1');

    fireEvent.press(btnSubmit);
    expect(mockSubmitLoc).toBeCalledWith('B1-1');
  });

  it('should call mock func on setEnterLocation', async () => {
    const mockSetEnterLoc = jest.fn();
    const { getByTestId } = render(
      <EnterLocation
        setEnterLocation={mockSetEnterLoc}
        onSubmit={jest.fn()}
      />
    );
    const btnSetEnterLoc = getByTestId('btnSetEnterLoc');

    fireEvent.press(btnSetEnterLoc);
    expect(mockSetEnterLoc).toBeCalledTimes(1);
  });
});
