import axios, { AxiosInstance, AxiosRequestConfig, Canceler } from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import moment from 'moment';
import qs from 'qs';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import { store } from '../../App';
import {
  getConsumerId, getEnvironment, getWmSvcEnv, svcName
} from '../utils/environment';

/**
 * Base on Axios network request.
 *
 */

// Define request type constants
enum Methods {
  POST = 'post',
  GET = 'get',
  HEAD = 'head',
  DELETE = 'delete',
  PUT = 'put',
}
const TIMEOUT = 10000;

class RequestDispatch {
  public service: AxiosInstance;

  private requestStartTime: number;

  constructor() {
    this.service = axios.create({
      timeout: TIMEOUT,
      headers: {
        'User-Agent': Platform.OS,
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    this.requestStartTime = 0;

    // Custom request interceptor
    this.service.interceptors.request.use(
      async (request: any) => {
        // Custom headers here
        const interceptRequest = await this.settingHeaders(request);
        const envUrls = getEnvironment();
        const isOrchUrl: boolean = request.url.includes(envUrls.orchestrationURL);

        if (request.url.includes(envUrls.fluffyURL)) {
          interceptRequest.headers['wm_svc.name'] = svcName.fluffyName;
          interceptRequest.headers['wm_sec.auth_token'] = store.getState().User.token;
          interceptRequest.headers['wm_consumer.id'] = getConsumerId();
          interceptRequest.headers['wm_svc.version'] = '1.0.0';
          interceptRequest.headers['wm_svc.env'] = Config.ENVIRONMENT === 'prod' ? 'prod' : 'stg';
        }
        else {
          interceptRequest.headers.userId = store.getState().User.userId;
          interceptRequest.headers.countryCode = store.getState().User.countryCode;
          interceptRequest.headers.clubNbr = store.getState().User.siteId;

          if (request.url.includes(envUrls.worklistURL)) {
            interceptRequest.headers['wm_svc.name'] = svcName.worklistName;
          } else if (isOrchUrl) {
            interceptRequest.headers['wm_svc.name'] = svcName.orchestrationName;
          } else if (request.url.includes(envUrls.itemDetailsURL)) {
            interceptRequest.headers['wm_svc.name'] = svcName.itemDetailsName;
          }
          interceptRequest.headers['wm_consumer.id'] = getConsumerId();
          interceptRequest.headers['wm_svc.env'] = getWmSvcEnv(isOrchUrl);
        }
        this.requestStartTime = moment().valueOf();
        return interceptRequest;
      },
      (err: any) => {
        console.warn(err);
        return Promise.reject(err);
      }
    );

    // Custom response interceptor
    this.service.interceptors.response.use(
      (response: any) => {
        // eslint-disable-next-line no-console
        console.log('✅ ', response.config.url, '\n', response);
        return response;
      },
      (err: any) => {
        // if the API call was cancelled due to a timeout, err will not have a config object
        // it will also not have a response object, but that will not cause the console.log to fail
        if (err.config) {
          // eslint-disable-next-line no-console
          console.log('❌ ', err.config.url, err.config, err.response);
        }
        const message = err.message.toLowerCase();
        if (!err.response && this.stringContains(message, 'network error')) {
          // The site can’t be reached, server IP address could not be found.
          console.warn('IP address could not be found');
        } else if (!err.response && this.stringContains(message, 'timeout')) {
          // Network request timeout
          console.warn('network request timeout');
        } else if (this.stringContains(message, 'network error')) {
          // Network error
          console.warn('network error');
        } else if (err.response.status === 500) {
          // Request failed with status code 500, Internal Server Error
        } else if (err.response.status === 415) {
          // Request failed with status code 415, Unsupported Media Type
        } else if (err.response.status === 409) {
          // Request failed with status code 409, Conflict
        } else if (err.response.status === 404) {
          // Request failed with status code 404, Not Found
        } else if (err.response.status === 403) {
          // Request failed with status code 403, Forbidden
        } else if (err.response.status === 401) {
          // Request failed with status code 401, Unauthorized
          console.warn(err.response.data.reason);
        } else if (err.response.status === 400) {
          // Request failed with status code 400, Bad Request
        }
        return Promise.reject(err);
      }
    );
  }

  stringContains = (string: string, pattern: string) => string.indexOf(pattern) !== -1;

  settingHeaders = async (request: any) => request;

  async axiosPromise(config: AxiosRequestConfig) {
    // this creates a cancelToken for the request
    const AxiosCancelToken = axios.CancelToken;
    let cancel: Canceler;
    config.cancelToken = new AxiosCancelToken(c => {
      cancel = c;
    });
    const timeoutInterval: number = config.timeout ? config.timeout : TIMEOUT;

    // if the request doesn't complete by the specified timeout period, cancel the request and reject the promise
    const timeoutID = setTimeout(() => {
      console.warn('service call cancelled', config);
      cancel('timeout');
    }, timeoutInterval);
    const result = await this.service(config);
    // clear the timeout if the request does complete
    clearTimeout(timeoutID);
    return result;
  }

  /**
   * Enqueue network request
   *
   * @param {string} method Methods.GET Methods.POST Methods.HEAD Methods.PUT Methods.DELETE
   * @param {string} router like user/login
   * @param {object} data object
   * @param {object} cancelToken cancelToken object, can cancel the reuqest
   */
  enqueue(method: Methods, router: string, data: any, cancelToken: any): Promise<any> {
    return new Promise((resolve, reject) => {
      switch (method) {
        case Methods.GET:
          this.service.get(`${router}?${qs.stringify(data)}`, { cancelToken })
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
          break;
        case Methods.POST:
          this.service.post(router, qs.stringify(data), { cancelToken })
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
          break;
        case Methods.PUT:
          this.service.put(router, qs.stringify(data), { cancelToken })
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
          break;
        case Methods.HEAD:
          this.service.head(`${router}?${qs.stringify(data)}`, { cancelToken })
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
          break;
        case Methods.DELETE:
          this.service.delete(`${router}?${qs.stringify(data)}`, { cancelToken })
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              reject(e);
            });
          break;
        default:
          break;
      }
    });
  }
}

/**
 * Base on Axios, support for get/head/post/put/delete requests,
 * support for setting cancellation requests.
 *
 * Universally get reqeust:
 * <pre>
 * Request.get('/login', {
 *   username: '1',
 *   password: '1'
 * }).then((res) => {
 *   // todo
 * }).catch((e) => {
 *   // todo
 * })
 * </pre>
 *
 * You can also add a cancel function to the reqeust.
 * <pre>
 * let cancel;
 * Request.get('/login', {
 *   username: '1',
 *   password: '1'
 * }, (c) => {
 *   cancel = c;
 * }).then((res) => {
 *   // todo
 * }).catch((e) => {
 *   // todo
 * })
 * cancel('cancel message.');
 * </pre>
 *
 * You may without request filed.
 * <pre>
 * let cancel;
 * Request.get('/login', (c) => {
 *   cancel = c;
 * }).then((res) => {
 *   // todo
 * }).catch((e) => {
 *   // todo
 * })
 * cancel('cancel message.');
 * </pre>
 *
 * Custom reqeust
 * `params` is the URL parameter to be sent with the request. 'GET', 'HEAD'.
 * `data` is the data that is sent as the request body, applicable only to
 * these request methods 'PUT', 'POST', and 'PATCH'
 * <code>
 * Request.enqueue({
 *  method: 'get',
 *  url: 'http://172.16.3.86:3002',
 *  headers: {
 *   'X-Custom-Header': 'foobar'
 *  },
 *  params: {
 *     id: 123
 *  },
 *  data: {
 *     username: 'admin'
 *  }
 * }).then((res) => {
 *     console.log(res);
 * }).catch((e) => {
 *
 * });
 * </code>
 * @class Request
 */

const { CancelToken } = axios;

const getParams = (data: any, fn: any) => {
  let requestData: any;
  let cancelCallback: any;
  if (typeof data === 'function') {
    cancelCallback = data;
  } else if (typeof fn === 'function') {
    requestData = data;
    cancelCallback = fn;
  } else {
    requestData = data;
  }
  const cancelToken = new CancelToken(c => {
    if (typeof cancelCallback === 'function') {
      cancelCallback(c);
    }
  });

  return {
    requestData,
    cancelToken
  };
};

class Request {
  private static instance?: Request;

  public dispatch: RequestDispatch;

  constructor() {
    this.dispatch = new RequestDispatch();
  }

  static getInstance() {
    if (!Request.instance) {
      Request.instance = new Request();
    }
    return Request.instance;
  }

  enqueue(config: AxiosRequestConfig) {
    return this.dispatch.axiosPromise(config);
  }

  delete(router: string, data: any, fn?: () => {}) {
    const { requestData, cancelToken } = getParams(data, fn);
    return this.dispatch.enqueue(Methods.DELETE, router, requestData, cancelToken);
  }

  get(router: string, data: any, fn?: () => {}) {
    const { requestData, cancelToken } = getParams(data, fn);
    return this.dispatch.enqueue(Methods.GET, router, requestData, cancelToken);
  }

  post(router: string, data: any, fn?: () => {}) {
    const { requestData, cancelToken } = getParams(data, fn);
    return this.dispatch.enqueue(Methods.POST, router, requestData, cancelToken);
  }

  put(router: string, data: any, fn?: () => {}) {
    const { requestData, cancelToken } = getParams(data, fn);
    return this.dispatch.enqueue(Methods.PUT, router, requestData, cancelToken);
  }

  head(router: string, data: any, fn?: () => {}) {
    const { requestData, cancelToken } = getParams(data, fn);
    return this.dispatch.enqueue(Methods.HEAD, router, requestData, cancelToken);
  }
}

export default Request.getInstance();
