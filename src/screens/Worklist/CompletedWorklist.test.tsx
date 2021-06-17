import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { mockWorkListComplete, mockWorkListToDo } from '../../mockData/mockWorkList';
import { CompletedWorklistScreen } from './CompletedWorklist';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;
describe('CompletedWorklistScreen', () => {
  describe('Tests rendering Worklist data', () => {
    it('Renders no worklist items when all are incomplete', () => {
      const renderer = ShallowRenderer.createRenderer();
      const toDoWorklistResult = {
        data: mockWorkListToDo
      };
      renderer.render(
        <CompletedWorklistScreen
          isWaiting={false}
          result={toDoWorklistResult}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders every worklist item when all are complete', () => {
      const renderer = ShallowRenderer.createRenderer();
      const completeWorklistResult = {
        data: mockWorkListComplete
      };
      renderer.render(
        <CompletedWorklistScreen
          isWaiting={false}
          result={completeWorklistResult}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders only complete worklist items for a Worklist with incomplete & complete items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mixedWorklistResult = {
        data: [...mockWorkListToDo, ...mockWorkListComplete]
      };
      renderer.render(
        <CompletedWorklistScreen
          isWaiting={false}
          result={mixedWorklistResult}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders no worklist items when there are none', () => {
      const renderer = ShallowRenderer.createRenderer();
      const emptyWorklistResult = {
        data: []
      };
      renderer.render(
        <CompletedWorklistScreen
          isWaiting={false}
          result={emptyWorklistResult}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering worklist api responses', () => {
    it('Renders error message for failed worklist request', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <CompletedWorklistScreen
          isWaiting={false}
          result={null}
          error="Network Error"
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders refresh set to true when waiting for worklist api response', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <CompletedWorklistScreen
          isWaiting={true}
          result={null}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
