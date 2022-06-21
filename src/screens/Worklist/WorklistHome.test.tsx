import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import WorklistHome from './WorklistHome';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native') as any,
  useNavigation: () => jest.fn
}));

describe('WorkListHome', () => {
  describe('Tests rendering the WorkListHome Screen', () => {
    it('Renders WorkListHome screen', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <WorklistHome />
      );

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
