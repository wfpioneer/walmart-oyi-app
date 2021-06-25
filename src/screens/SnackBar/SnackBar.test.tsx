import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../locales';
import { SnackBarComponent } from './SnackBar';

describe('SnackBarComponent', () => {
  it('Renders the default snack bar component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <SnackBarComponent
        showSnackBar={false}
        dispatch={jest.fn()}
        messageContent=""
        duration={5000}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the snack bar component with a message', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <SnackBarComponent
        showSnackBar={true}
        dispatch={jest.fn()}
        messageContent={strings('GENERICS.UPDATED')}
        duration={5000}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
