import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ListGroup from './ListGroup';
import { mockPickLists } from '../../mockData/mockPickList';

describe('ListGroup', () => {
  describe('Tests rendering the ListGroup component', () => {
    it('Test renders the ListGroup component with groupItems prop as false', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ListGroup
          groupItems={false}
          pickListItems={mockPickLists}
          title="AbAR-2"
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the ListGroup component with groupItems prop as true', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ListGroup
          groupItems={true}
          pickListItems={mockPickLists}
          title="AbAR-2"
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
