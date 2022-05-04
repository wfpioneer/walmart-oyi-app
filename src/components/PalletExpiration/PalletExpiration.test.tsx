import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import PalletExpiration from './PalletExpiration';

describe('Tests rendering PalletExpiration', () => {
  let testExpirationDate: string | undefined = '05/31/2022';
  let testNewExpirationDate: string | undefined;
  const testSetShowPicker = jest.fn();
  const testDateChange = jest.fn();
  const testDate = new Date("10/17/1973");

  it('Renders the PalletExpiration with expiration date and no changes', () => {
    const { toJSON } = render(
      <PalletExpiration
        expirationDate={testExpirationDate}
        newExpirationDate={testNewExpirationDate}
        showPicker={false}
        setShowPicker={testSetShowPicker}
        dateRemoved={false}
        dateChanged={false}
        onDateChange={testDateChange}
        minimumDate={testDate}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the PalletExpiration with no expiration date and no changes', () => {
    testExpirationDate = undefined;

    const { toJSON } = render(
      <PalletExpiration
        expirationDate={testExpirationDate}
        newExpirationDate={testNewExpirationDate}
        showPicker={false}
        setShowPicker={testSetShowPicker}
        dateRemoved={false}
        dateChanged={false}
        onDateChange={testDateChange}
        minimumDate={testDate}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the PalletExpiration with newExpiration date', () => {
    testNewExpirationDate = '05/31/2022';

    const { toJSON } = render(
      <PalletExpiration
        expirationDate={testExpirationDate}
        newExpirationDate={testNewExpirationDate}
        showPicker={false}
        setShowPicker={testSetShowPicker}
        dateRemoved={false}
        dateChanged={true}
        onDateChange={testDateChange}
        minimumDate={testDate}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the PalletExpiration with date removed', () => {
    testNewExpirationDate = undefined;

    const { toJSON } = render(
      <PalletExpiration
        expirationDate={testExpirationDate}
        newExpirationDate={testNewExpirationDate}
        showPicker={false}
        setShowPicker={testSetShowPicker}
        dateRemoved={true}
        dateChanged={true}
        onDateChange={testDateChange}
        minimumDate={testDate}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the PalletExpiration showing picker', () => {
    testExpirationDate = '5/30/2002';
    testNewExpirationDate = undefined;

    const { toJSON } = render(
      <PalletExpiration
        expirationDate={testExpirationDate}
        newExpirationDate={testNewExpirationDate}
        showPicker={true}
        setShowPicker={testSetShowPicker}
        dateRemoved={true}
        dateChanged={true}
        onDateChange={testDateChange}
        minimumDate={testDate}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('exercise onClick and onDateChange', () => {
    testExpirationDate = '5/30/2002';
    testNewExpirationDate = undefined;

    const { toJSON, getByTestId } = render(
      <PalletExpiration
        expirationDate={testExpirationDate}
        newExpirationDate={testNewExpirationDate}
        showPicker={true}
        setShowPicker={testSetShowPicker}
        dateRemoved={true}
        dateChanged={true}
        onDateChange={testDateChange}
        minimumDate={testDate}
      />
    );
    const testClick = getByTestId('openDate');
    const testChange = getByTestId('datePicker');
    fireEvent.press(testClick);
    expect(testSetShowPicker).toBeCalledTimes(1);
    fireEvent(testChange, 'onChange', { nativeEvent: { timestamp: '01/01/1976' } });
    expect(testDateChange).toBeCalledTimes(1);
  });
});
