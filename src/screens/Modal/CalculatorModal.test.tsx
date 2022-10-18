import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import CalculatorModal from './CalculatorModal';
import store from '../../state';
import { setCalculatorOpen } from '../../state/actions/Global';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn().mockImplementation(() => { }),
    useDispatch: () => mockDispatch
  };
});

describe('Calculator Modal render tests', () => {
  it('does not show when calcOpen is set to false', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <CalculatorModal />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('show when calcOpen is set to true', () => {
    const renderer = ShallowRenderer.createRenderer();
    store.dispatch(setCalculatorOpen(true));
    renderer.render(
      <Provider store={store}>
        <CalculatorModal />
      </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
