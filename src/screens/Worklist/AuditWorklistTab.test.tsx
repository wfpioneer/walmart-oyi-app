import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import {
  mockCompletedAuditWorklist, mockToDoAuditWorklist
} from '../../mockData/mockWorkList';
import {
  AuditWorklistTabScreen
} from './AuditWorklistTab';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

let navigationProp: NavigationProp<any>;
describe('AuditWorklistTab', () => {
  const mockDispatch = jest.fn();
  describe('Tests rendering Audit worklist component', () => {
    it('Renders to-do Audit worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditWorklistTabScreen
          items={mockToDoAuditWorklist}
          toDo
          navigation={navigationProp}
          dispatch={mockDispatch}
          collapsed={false}
          setCollapsed={jest.fn}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completed Audit worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditWorklistTabScreen
          items={mockCompletedAuditWorklist}
          toDo={false}
          navigation={navigationProp}
          dispatch={mockDispatch}
          collapsed={false}
          setCollapsed={jest.fn}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering AuditWorklistTab component with collapsible prop', () => {
    it('Renders the worklist items in collapsible mode when collapse button clicked', () => {
      const { toJSON, getByTestId } = render(
        <AuditWorklistTabScreen
          items={mockToDoAuditWorklist}
          toDo
          navigation={navigationProp}
          dispatch={mockDispatch}
          collapsed={false}
          setCollapsed={jest.fn}
        />
      );
      const btnCollapse = getByTestId('collapse-text-btn');
      fireEvent.press(btnCollapse);
      expect(toJSON()).toMatchSnapshot();
    });
    it('Renders the worklist items in open mode when expand button clicked', () => {
      const { toJSON, getByTestId } = render(
        <AuditWorklistTabScreen
          items={mockToDoAuditWorklist}
          toDo
          navigation={navigationProp}
          dispatch={mockDispatch}
          collapsed={true}
          setCollapsed={jest.fn}
        />
      );
      const btnCollapse = getByTestId('collapse-text-btn');
      fireEvent.press(btnCollapse);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
