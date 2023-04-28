import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { PendingWorklistScreen } from './PendingWorklist';
import { mockWorkListComplete, mockWorkListPending, mockWorkListToDo } from '../../mockData/mockWorkList';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;
describe('PendingWorklistScreen', () => {
  describe('Tests rendering Worklist data', () => {
    it('Renders array of pending worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const toDoWorklistResult = {
        data: mockWorkListPending
      };
      renderer.render(
        <PendingWorklistScreen
          isWaiting={false}
          result={toDoWorklistResult}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
          areas={[]}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
          onHandsEnabled={true}
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
        <PendingWorklistScreen
          isWaiting={false}
          result={completeWorklistResult}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
          areas={[]}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
          onHandsEnabled={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering worklist api responses', () => {
    it('Renders error message for failed worklist request', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <PendingWorklistScreen
          isWaiting={false}
          result={null}
          error="Network Error"
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
          areas={[]}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
          onHandsEnabled={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders refresh set to true waiting for worklist api response', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <PendingWorklistScreen
          isWaiting={true}
          result={null}
          error={null}
          dispatch={jest.fn()}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          navigation={navigationProp}
          areas={[]}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
          onHandsEnabled={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
