import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { TodoWorklistScreen } from './TodoWorklist';
import { mockWorkListComplete, mockWorkListToDo } from '../../mockData/mockWorkList';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
describe('ToDoWorklistScreen', () => {
  describe('Tests rendering Worklist data', () => {
    it('Renders array of uncompleted worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const toDoWorklistResult = {
        data: mockWorkListToDo
      };
      renderer.render(
        <TodoWorklistScreen
          isWaiting={false}
          result={toDoWorklistResult}
          error={null}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders empty array for completed worklist items ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const completeWorklistResult = {
        data: mockWorkListComplete
      };
      renderer.render(
        <TodoWorklistScreen
          isWaiting={false}
          result={completeWorklistResult}
          error={null}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Should only render incomplete items for a WorkList with incomplete & complete items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mixedWorklistResult = {
        data: [...mockWorkListToDo, ...mockWorkListComplete]
      };
      renderer.render(
        <TodoWorklistScreen
          isWaiting={false}
          result={mixedWorklistResult}
          error={null}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders empty array for zero worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const emptyWorklistResult = {
        data: []
      };
      renderer.render(
        <TodoWorklistScreen
          isWaiting={false}
          result={emptyWorklistResult}
          error={null}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering worklist api responses', () => {
    it('Renders error message for failed worklist request', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <TodoWorklistScreen
          isWaiting={false}
          result={null}
          error="Network Error"
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders refresh set to true waiting for worklist api response', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <TodoWorklistScreen
          isWaiting={true}
          result={null}
          error={null}
          dispatch={jest.fn()}
          useEffectHook={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
