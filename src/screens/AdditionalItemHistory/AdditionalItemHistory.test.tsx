import React from 'react';
import { render } from '@testing-library/react-native';
import { mockOHChangeHistory } from '../../mockData/getItemDetails';
import { AdditionalItemHistoryScreen } from './AdditionalItemHistory';

describe('AdditionalItemHistoryScreen', () => {
  it('Renders the AdditionItemHistoryScreen', () => {
    const { toJSON } = render(
      <AdditionalItemHistoryScreen onHandsData={mockOHChangeHistory} />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
