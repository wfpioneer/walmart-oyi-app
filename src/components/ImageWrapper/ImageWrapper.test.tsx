import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { render } from '@testing-library/react-native';
import ImageWrapper from './ImageWrapper';
import * as utils from './ImageWrapperUtils';

const mockSetImgState = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn().mockImplementation(init => [init, mockSetImgState])
}));

const mockUUIDSuccessResponse = {
  response: {
    entities: [{
      id: '184073ec-7b7c-4616-a8e6-9748f26166cd', name: '123456', type: 'item', domain: ''
    }],
    status: 'success',
    totalRecords: 1
  }
};

const mockUUIDAprUrlCN = utils.uuidApiUrlCN;
const mockImageSuccessResponse = {
  response: {
    entities: [{
      id: '184073ec-7b7c-4616-a8e6-9748f26166cd',
      name: '123456',
      type: 'item',
      domain: '',
      data: {
        relationships: {
          hasimages: [{
            id: '8e733b0a-8bdf-4320-8f94-7523cc92e961',
            relTo: {
              id: 'khucAZJDRlaGhybfNxR0yg',
              type: 'image',
              data: {
                attributes: {
                  downloadURL: { values: [{ value: 'final-image-url', source: 'internal', locale: 'zh-CN' }] }
                }
              }
            }
          }]
        }
      }
    }],
    status: 'success',
    totalRecords: 1
  }
};

const mockUUIDJsonPromise = Promise.resolve(mockUUIDSuccessResponse);
const mockImgJsonPromise = Promise.resolve(mockImageSuccessResponse);

const mockFetchUUIDPromise = Promise.resolve({
  json: () => mockUUIDJsonPromise
});
const mockFetchImgPromise = Promise.resolve({
  json: () => mockImgJsonPromise
});

jest.mock('./ImageWrapperUtils', () => {
  const actual = jest.requireActual('./ImageWrapperUtils');
  // The code from the previous step
  return {
    ...actual,
    postApiCall: jest.fn().mockImplementation((url: string, data: any) => {
      if (url === mockUUIDAprUrlCN) {
        return mockFetchUUIDPromise;
      }
      return mockFetchImgPromise;
    })
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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Should call post api to fetch image for country code CN', () => {
    render(
      <ImageWrapper
        countryCode="CN"
        itemNumber={12345}
      />
    );

    const uuidDataParams = {
      params: {
        query: {
          filters: {
            typesCriterion: [
              'item'
            ],
            attributesCriterion: [{
              itemnumber: {
                exact: '12345'
              }
            }]
          }
        }
      }
    };

    expect(utils.postApiCall).toBeCalledTimes(1);
    expect(utils.postApiCall).toBeCalledWith(utils.uuidApiUrlCN, JSON.stringify(uuidDataParams));
  });
});
