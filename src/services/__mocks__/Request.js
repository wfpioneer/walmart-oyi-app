export const postMock = jest.fn();
export const getMock = jest.fn();
export const putMock = jest.fn();
export const patchMock = jest.fn();
export const deleteMock = jest.fn();

export const mockGetCancelToken = jest.fn();

const requestsMock = jest.mock('../Request', () => ({
  getInstance: jest.fn(() => ({
    post: postMock,
    get: getMock,
    put: putMock,
    patch: patchMock,
    delete: deleteMock,
    getCancelToken: mockGetCancelToken
  }))
}));

export default requestsMock;
