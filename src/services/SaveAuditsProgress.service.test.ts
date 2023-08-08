import { AxiosResponse } from 'axios';
import { getEnvironment } from '../utils/environment';
import Request, { mockAxiosResponse } from './Request';
import SaveAuditsProgressService from './SaveAuditsProgress.service';

describe('SaveAuditProgress Service Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TODO refactor test Spike story for Mock Service Worker
  it('calls getAuditLocations', async () => {
    const getAudLoc = SaveAuditsProgressService.getAuditLocations;
    mockAxiosResponse(undefined);
    const mockResponse = { data: {}, status: 200, statusText: 'ok' } as AxiosResponse;
    const getRequestSpy = jest.spyOn(Request, 'get');
    getRequestSpy.mockResolvedValue(mockResponse);
    const urls = getEnvironment();

    const getAudLocResponse = await getAudLoc({ itemNbr: 123, hours: 5 });
    expect(getRequestSpy).toHaveBeenCalledWith(
      `${urls.orchestrationURL}/worklist/audits/${123}?timelimit=5`
    );
    expect(getAudLocResponse).toStrictEqual(mockResponse);

    getAudLoc({ itemNbr: 456 });
    expect(getRequestSpy).toHaveBeenCalledWith(
      `${urls.orchestrationURL}/worklist/audits/${456}`
    );
  });
});
