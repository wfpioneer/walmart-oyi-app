import React from 'react';
import { render } from '@testing-library/react-native';
import { ItemHistoryScreen } from './ItemHistory';

describe('Tests Rendering', () => {
  it('Renders item history flat list', () => {
    const data = [{
      id: 1,
      date: '2022-07-23',
      qty: 22
    }, {
      id: 2,
      date: '2022-07-19',
      qty: 30
    }];
    const component = (
      <ItemHistoryScreen data={data} />
    );
    const { toJSON } = render(component);
    expect(toJSON()).toMatchSnapshot();
  });
});
