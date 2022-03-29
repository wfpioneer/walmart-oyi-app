import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { CreatePickDialog, MOVE_TO_FRONT } from './CreatePickDialog';

describe('Test createPickDialog Component', () => {
  it('Renders the createPickDialog component with location other than moveToFront selected', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CreatePickDialog
        selectedSection={''}
        setSelectedSection={jest.fn()}
        numberOfPallets={1}
        setNumberOfPallets={jest.fn()}
        isQuickPick={false}
        setIsQuickPick={jest.fn()}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        locations={[]}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the createPickDialog component with location moveToFront selected', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <CreatePickDialog
        selectedSection={MOVE_TO_FRONT}
        setSelectedSection={jest.fn()}
        numberOfPallets={1}
        setNumberOfPallets={jest.fn()}
        isQuickPick={false}
        setIsQuickPick={jest.fn()}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        locations={[]}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
