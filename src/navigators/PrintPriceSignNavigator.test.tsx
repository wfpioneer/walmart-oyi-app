import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../locales';
import PrintPriceSignNavigator, { getHeaderTitle } from './PrintPriceSignNavigator';
import store from '../state';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn().mockImplementation(() => { }),
    useDispatch: () => mockDispatch
  };
});

describe('PrintPriceSignNavigator render tests', () => {
  it('render with print title as Main', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <PrintPriceSignNavigator />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('test getHeaderTitle', () => {
    expect(getHeaderTitle('', false)).toBe(strings('PRINT.MAIN_TITLE'));
    expect(getHeaderTitle('print location labels', false)).toBe(strings('PRINT.LOCATION_TITLE'));
    expect(getHeaderTitle('', true)).toBe(strings('PRINT.PALLET_TITLE'));
  });
});
