import { AxiosResponse } from 'axios';
import { getEnvironment } from '../utils/environment';
import Request from './Request';
import GetWorklistService from './GetWorklist.service';

describe('Get Worklist Service Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TODO refactor test Spike story for Mock Service Worker
  it('ensures that the get audit worklist v1 function calls correctly', async () => {
    const getAuditWorklistV1 = GetWorklistService.getWorklistAuditV1;
    const mockResponse = { data: [], status: 200, statusText: 'ok' } as AxiosResponse;
    const getRequestSpy = jest.spyOn(Request, 'get');
    getRequestSpy.mockResolvedValue(mockResponse);
    const urls = getEnvironment();
    const baseUrl = `${urls.worklistURL}/worklist/v1/audits`;

    let getWorklistResponse = await getAuditWorklistV1({ worklistType: ['AU', 'RA'] });
    expect(getWorklistResponse).toStrictEqual(mockResponse);
    expect(getRequestSpy).toHaveBeenCalledWith(`${baseUrl}?type=AU&type=RA`, undefined);
    getRequestSpy.mockClear();

    getWorklistResponse = await getAuditWorklistV1({ worklistType: [] });
    expect(getRequestSpy).toHaveBeenCalledWith(baseUrl, undefined);
    getRequestSpy.mockClear();

    getWorklistResponse = await getAuditWorklistV1({});
    expect(getRequestSpy).toHaveBeenCalledWith(baseUrl, undefined);
  });
});
