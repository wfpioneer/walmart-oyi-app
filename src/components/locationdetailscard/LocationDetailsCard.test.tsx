import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import LocationDetailsCard from './LocationDetailsCard';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('Tests rendering LocationDetailsCard', () => {
  it('Renders the LocationDetailsCard for location type reserve', () => {
    const { toJSON } = render(
      <LocationDetailsCard
        locationName="A1-1"
        locationType="Reserve"
        editAction={jest.fn()}
        deleteAction={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('Renders the LocationDetailsCard for location type floor and onaction btn click call mock function', () => {
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();

    const { getByTestId, toJSON } = render(
      <LocationDetailsCard
        locationName="A1-1"
        locationType="Floor"
        editAction={mockEdit}
        deleteAction={mockDelete}
      />
    );
    expect(toJSON()).toMatchSnapshot();
    const editBtn = getByTestId('pencil');
    const deleteBtn = getByTestId('trash-can');
    fireEvent.press(editBtn);
    fireEvent.press(deleteBtn);
    expect(mockEdit).toBeCalledTimes(1);
    expect(mockDelete).toBeCalledTimes(1);
  });
});
