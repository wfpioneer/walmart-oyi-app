import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AsyncState } from '../../models/AsyncState';
import { AddItemsScreen } from './AddItems';

let navigationProp: NavigationProp<any>;
describe('AddItemScreen', () => {
  const renderer = ShallowRenderer.createRenderer();
  const invalidUPC = '123abc';
  const validUPC = '123456';
  const addItemResult = {
    status: 204,
    data: ''
  };
  const getSectionEmptyResponse: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: addItemResult
  };
  it('Renders Error for Item containing non number digits', () => {
    renderer.render(
      <AddItemsScreen
        upc={invalidUPC}
        updateUPC={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        section={{ id: 1, name: '1' }}
        addAPI={getSectionEmptyResponse}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Enabled Submit button for Item containing only numeric digits', () => {
    renderer.render(
      <AddItemsScreen
        upc={validUPC}
        updateUPC={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        useEffectHook={jest.fn()}
        section={{ id: 1, name: '1' }}
        addAPI={getSectionEmptyResponse}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  describe('Rendering Add Item responses', () => {
    const apiIsWaiting = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    it('Renders the waiting for response from Add Item', () => {
      renderer.render(
        <AddItemsScreen
          upc={validUPC}
          updateUPC={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          addAPI={apiIsWaiting}
          section={{ id: 1, name: '1' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the success response from Add Item', () => {
      renderer.render(
        <AddItemsScreen
          upc={validUPC}
          updateUPC={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          useEffectHook={jest.fn()}
          addAPI={getSectionEmptyResponse}
          section={{ id: 1, name: '1' }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
