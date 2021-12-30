import _ from 'lodash';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AsyncState } from '../../models/AsyncState';
import ApiConfirmationModal from './ApiConfirmationModal';

const defaultAsyncState: AsyncState = {
  error: null,
  isWaiting: false,
  result: null,
  value: null
};

describe('Api Confirmation Modal render tests', () => {
  it('does not show when isVisible is set to false', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApiConfirmationModal
        api={defaultAsyncState}
        handleConfirm={jest.fn()}
        isVisible={false}
        mainText="I am the main text"
        onClose={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly when the the api is at rest, one line of text', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApiConfirmationModal
        api={defaultAsyncState}
        handleConfirm={jest.fn()}
        isVisible={true}
        mainText="I am the main text"
        onClose={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly when the api is at rest, two lines of text', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApiConfirmationModal
        api={defaultAsyncState}
        handleConfirm={jest.fn()}
        isVisible={true}
        mainText="I am the main text"
        subtext1="I am the secondary line of text"
        onClose={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly when the api is at rest, three lines of text', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApiConfirmationModal
        api={defaultAsyncState}
        handleConfirm={jest.fn()}
        isVisible={true}
        mainText="I am the main text"
        subtext1="I am the secondary line of text"
        subtext2="I am the tertiary line of text"
        onClose={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly when the api is in flight', () => {
    const renderer = ShallowRenderer.createRenderer();
    const inFlightAsyncState = _.cloneDeep(defaultAsyncState);
    inFlightAsyncState.isWaiting = true;
    inFlightAsyncState.value = {};
    renderer.render(
      <ApiConfirmationModal
        api={inFlightAsyncState}
        handleConfirm={jest.fn()}
        isVisible={true}
        mainText="I am the main text"
        subtext1="I am the secondary line of text"
        onClose={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly when the api has failed', () => {
    const renderer = ShallowRenderer.createRenderer();
    const failedAsyncState = _.cloneDeep(defaultAsyncState);
    failedAsyncState.isWaiting = true;
    failedAsyncState.value = {};
    failedAsyncState.error = { status: 400, message: 'bad request' };
    renderer.render(
      <ApiConfirmationModal
        api={failedAsyncState}
        handleConfirm={jest.fn()}
        isVisible={true}
        mainText="I am the main text"
        subtext1="I am the secondary line of text"
        onClose={jest.fn()}
      />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
