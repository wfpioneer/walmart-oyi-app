import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { render, waitFor } from '@testing-library/react-native';
import ImageWrapper, { createSource, setCNImageUri } from './ImageWrapper';
import * as utils from './ImageWrapperUtils';
import { getEnvironment } from '../../utils/environment';

const mockSetImgState = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn().mockImplementation(init => [init, mockSetImgState])
}));

jest.mock('../../utils/environment', () => {
  const environments = jest.requireActual('../../utils/environment');
  return {
    ...environments,
    getEnvironment: jest.fn().mockImplementation(() => ({
      itemCenterRiversandURL: 'http://esb.cn.wal-mart.com/ssp-item-oe/riversand/export/es/info'
    }))
  };
});

const mockItemCenterRiverSandSuccessResponse = {
  data: [
    {
      data: {
        relationShips: {
          hasImages: [
            {
              walmartOssUploadId: 'dummyImage.jpg',
              imageIsPrimary: true
            }
          ]
        }
      }
    }
  ]
};

const mockItemCenterRiverSandJsonPromise = Promise.resolve(mockItemCenterRiverSandSuccessResponse);

const mockFetchItemCenterPromise = Promise.resolve({
  json: () => mockItemCenterRiverSandJsonPromise
});

const mockFetchItemCenterPromiseFailure = Promise.reject(new Error('test error'));

const urls = getEnvironment();

jest.mock('./ImageWrapperUtils', () => {
  const actual = jest.requireActual('./ImageWrapperUtils');
  return {
    ...actual,
    postApiCall: jest.fn().mockImplementation(() => mockFetchItemCenterPromise)
  };
});

describe('ImageWrapper Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders a ImageWrapper with country code MX', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ImageWrapper
        countryCode="MX"
        itemNumber={12345}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a ImageWrapper with country code CN', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ImageWrapper
        countryCode="CN"
        itemNumber={12345}
        imageToken="dummyToken"
        tokenIsWaiting={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Should call post api to fetch image for country code CN', async () => {
    render(
      <ImageWrapper
        countryCode="CN"
        itemNumber={12345}
        imageToken="dummyToken"
        tokenIsWaiting={false}
      />
    );

    const itemCenterDataParams = {
      param: {
        itemNbrs: [12345]
      }
    };

    await waitFor(() => expect(utils.postApiCall).toHaveBeenCalledTimes(1));
    expect(utils.postApiCall).toBeCalledWith(urls.itemCenterRiversandURL, itemCenterDataParams);
  });
  it('test setCNImageUri', async () => {
    const mockDispatch = jest.fn();
    let mockPostApiCall = jest.fn().mockImplementation(() => mockFetchItemCenterPromise);
    setCNImageUri(1234, mockDispatch, mockPostApiCall);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    mockPostApiCall = jest.fn().mockImplementation(() => mockFetchItemCenterPromiseFailure);
    setCNImageUri(1234, mockDispatch, mockPostApiCall);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('test createSource', () => {
    const expectedCNResults = {
      uri: 'dummyCNUrl',
      headers: {
        clientId: 'oyi',
        accessToken: 'dummyToken'
      },
      priority: 'normal'
    };
    const expectedMXResults = {
      uri: 'dummyMXUrl',
      priority: 'normal'
    };
    const cnResults = createSource('dummyCNUrl', 'CN', 'dummyToken');
    const mxResults = createSource('dummyMXUrl', 'MX', undefined);
    expect(cnResults).toEqual(expectedCNResults);
    expect(mxResults).toEqual(expectedMXResults);
  });
});
