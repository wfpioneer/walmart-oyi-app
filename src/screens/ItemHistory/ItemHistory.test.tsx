import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import ItemHistory from './ItemHistory';
import store from '../../state/index';

describe('Tests Rendering', () => {
  it('Renders item history flat list', () => {
    const component = (
      <Provider store={store}>
        <ItemHistory />
      </Provider>
    );
    const { toJSON } = render(component);
    expect(toJSON()).toMatchSnapshot();
  });
});
