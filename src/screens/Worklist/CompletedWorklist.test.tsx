import React from 'react';
import * as redux from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { CompletedWorklist } from './CompletedWorklist';
import { mockWorkListComplete, mockWorkListToDo } from '../../mockData/mockWorkList';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

let navigationProp: NavigationProp<any>;
const mockGroupToggle = false;

const mockUseTypedSelectorData = {
  isWaiting: false,
  result: { data: mockWorkListToDo },
  error: null,
  filterExceptions: [],
  filterCategories: []
};

const setState = jest.fn();

const mockUseStateData: any = (initState: any) => [
  initState,
  setState
];

const spyOnUseSelector = jest.spyOn(redux, 'useSelector');
const spyOnUseState = jest.spyOn(React, 'useState');

spyOnUseState.mockReturnValue(mockUseStateData);

describe('CompletedWorklistScreen', () => {
  describe('Tests rendering Worklist data', () => {
    it('Renders no items for a worklist that contains only incomplete items', () => {
      spyOnUseSelector.mockReturnValue(mockUseTypedSelectorData);
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <CompletedWorklist />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders all items for a worklist that contains only complete items', () => {
      spyOnUseSelector.mockReturnValue({ ...mockUseTypedSelectorData, result: { data: mockWorkListComplete } });
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <CompletedWorklist />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders only complete items for a worklist that has complete and incomplete items', () => {
      spyOnUseSelector.mockReturnValue({
        ...mockUseTypedSelectorData,
        result: { data: [...mockWorkListComplete, ...mockWorkListToDo] }
      });
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <CompletedWorklist />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders no items for an empty list', () => {
      spyOnUseSelector.mockReturnValue({
        ...mockUseTypedSelectorData,
        result: { data: [] }
      });
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
          <CompletedWorklist />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
