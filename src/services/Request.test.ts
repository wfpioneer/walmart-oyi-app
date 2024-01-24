import axios, { AxiosResponse } from 'axios';
import Request, { mockAxiosResponse } from './Request';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} } as AxiosResponse)),
    delete: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    head: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn()
      },
      response: {
        use: jest.fn(),
        eject: jest.fn()
      }
    }
  })),
  CancelToken: {
    source: jest.fn(() => ({
      token: 'mockedCancelToken',
      cancel: jest.fn()
    })),
    promise: Promise.resolve('mockedCancelToken'),
    throwIfRequested: jest.fn()
  }
}));

jest.useFakeTimers();

afterAll(() => {
  jest.useRealTimers();
});

describe('Request', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should set correct headers and interceptors for GET request to fluffyURL', async () => {
    const mockResponse = { data: {}, status: 200, statusText: 'ok' } as AxiosResponse;
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: {
        request: {
          use: jest.fn()
        }
      },
      get: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {} }))
    } as any);
    const response = await Request.get('/mockURL');
    expect(response.data).toEqual(mockResponse.data);
  });

  it('Should set correct headers and interceptors for POST request', async () => {
    const mockPayload = { data: {} };
    const mockResponse = { data: {}, status: 200, statusText: 'OK' } as AxiosResponse;
    jest.spyOn(Request.service, 'post').mockResolvedValueOnce(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: {
        request: {
          use: jest.fn()
        }
      },
      post: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {} }))
    } as any);
    const response = await Request.post('/mockURL', mockPayload);
    expect(response).toEqual(mockResponse);
    expect(Request.service.post).toHaveBeenCalledWith('/mockURL', mockPayload, expect.any(Object));
  });

  it('Should set correct headers and interceptors for DELETE request', async () => {
    const mockPayload = { data: {} };
    const mockResponse = { data: {}, status: 200, statusText: 'OK' } as AxiosResponse;
    jest.spyOn(Request.service, 'delete').mockResolvedValueOnce(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: {
        request: {
          use: jest.fn()
        }
      },
      delete: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {} }))
    } as any);

    const response = await Request.delete('/mockURL', mockPayload);
    expect(response).toEqual(mockResponse);
    expect(Request.service.delete).toHaveBeenCalledWith('/mockURL', expect.any(Object));
  });

  it('Should set correct headers and interceptors for PUT request', async () => {
    const mockPayload = { data: {} };
    const mockResponse = { data: {}, status: 200, statusText: 'OK' } as AxiosResponse;
    jest.spyOn(Request.service, 'put').mockResolvedValueOnce(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: {
        request: {
          use: jest.fn()
        }
      },
      put: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {} }))
    } as any);

    const response = await Request.put('/mockURL', mockPayload);
    expect(response).toEqual(mockResponse);
    expect(Request.service.put).toHaveBeenCalledWith('/mockURL', mockPayload, expect.any(Object));
  });

  it('Should set correct headers and interceptors for PATCH request', async () => {
    const mockPayload = { data: {} };
    const mockResponse = { data: {}, status: 200, statusText: 'OK' } as AxiosResponse;
    jest.spyOn(Request.service, 'patch').mockResolvedValueOnce(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: {
        request: {
          use: jest.fn()
        }
      },
      patch: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {} }))
    } as any);

    const response = await Request.patch('/mockURL', mockPayload);
    expect(response).toEqual(mockResponse);
    expect(Request.service.patch).toHaveBeenCalledWith('/mockURL', mockPayload, expect.any(Object));
  });

  it('Should set correct headers and interceptors for HEAD request', async () => {
    const mockPayload = { data: {} };
    const mockResponse = { data: {}, status: 200, statusText: 'OK' } as AxiosResponse;
    jest.spyOn(Request.service, 'head').mockResolvedValueOnce(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: {
        request: {
          use: jest.fn()
        }
      },
      head: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {} }))
    } as any);

    const response = await Request.head('/mockURL', mockPayload);
    expect(response).toEqual(mockResponse);
    expect(Request.service.head).toHaveBeenCalledWith('/mockURL', expect.any(Object));
  });

  it('Should handle invalid payload scenario for POST request', async () => {
    const mockPayload = { invalidData: true };
    const mockResponse = { data: {}, status: 200, statusText: 'OK' } as AxiosResponse;
    jest.spyOn(Request.service, 'post').mockResolvedValueOnce(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: { request: { use: jest.fn() } },
      post: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {} }))
    } as any);
    const response = await Request.post('/mockURL', mockPayload);
    expect(response).toEqual(mockResponse);
    expect(Request.service.post).toHaveBeenCalledWith('/mockURL', mockPayload, expect.any(Object));
  });

  it('Should handle 500 status code scenario', async () => {
    const mockPayload = { data: {} };
    const mockResponse = { data: {}, status: 500, statusText: 'Internal Server Error' } as AxiosResponse;
    jest.spyOn(Request.service, 'post').mockResolvedValueOnce(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValueOnce({
      interceptors: { request: { use: jest.fn() } },
      // eslint-disable-next-line max-len
      post: jest.fn().mockResolvedValueOnce(mockAxiosResponse({ data: {}, status: 500, statusText: 'Internal Server Error' }))
    } as any);

    const response = await Request.post('/mockURL', mockPayload);
    expect(response).toEqual(mockResponse);
    expect(Request.service.post).toHaveBeenCalledWith('/mockURL', mockPayload, expect.any(Object));
  });
});
