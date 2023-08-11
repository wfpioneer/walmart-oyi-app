import { AxiosResponse } from 'axios';
import GetWorklistService from './GetWorklist.service';
import Request from './Request';

describe('Get Worklist Service Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TODO refactor test Spike story for Mock Service Worker
  it('ensures that the get audit worklist v1 function calls correctly', async () => {
    const getAuditWorklistV1 = GetWorklistService.getWorklistAuditV1;
    const mockResponse = { data: [], status: 200, statusText: 'ok' } as AxiosResponse;
    const getSpy = jest.spyOn(Request, 'get');
    getSpy.mockResolvedValue(mockResponse);

    const getWorklistResponse = await getAuditWorklistV1({ worklistType: ['AU'] });
    expect(getWorklistResponse).toStrictEqual(mockResponse);
  });
});
