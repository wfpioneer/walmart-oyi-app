import { AxiosResponse } from 'axios';
import GetWorklistService from './GetWorklist.service';
import Request, { mockAxiosResponse } from './Request';
import { getEnvironment } from '../utils/environment';

describe('Get Worklist Service Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TODO refactor test Spike story for Mock Service Worker
  it('ensures that the get audit worklist v1 function calls correctly', async () => {
    const urls = getEnvironment();
    const baseUrl = `${urls.worklistURL}/worklist/v1/audits`;
    const getAuditWorklistV1 = GetWorklistService.getWorklistAuditV1;
    mockAxiosResponse(undefined);
    const mockResponse = { data: [], status: 200, statusText: 'ok' } as AxiosResponse;
    const getSpy = jest.spyOn(Request, 'get');
    getSpy.mockResolvedValue(mockResponse);

    let getWorklistResponse = await getAuditWorklistV1({ worklistType: ['AU', 'RA'] });
    expect(getWorklistResponse).toStrictEqual(mockResponse);
    expect(getSpy).toHaveBeenCalledWith(`${baseUrl}?type=AU&type=RA`);
    getSpy.mockClear();

    getWorklistResponse = await getAuditWorklistV1({ worklistType: [] });
    expect(getSpy).toHaveBeenCalledWith(baseUrl);
    getSpy.mockClear();

    getWorklistResponse = await getAuditWorklistV1({});
    expect(getSpy).toHaveBeenCalledWith(baseUrl);
  });
});
