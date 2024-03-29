import { AxiosResponse } from 'axios';
import { getEnvironment } from '../utils/environment';
import Request from './Request';
import SaveAuditsProgressService from './SaveAuditsProgress.service';

describe('SaveAuditProgress Service Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TODO refactor test Spike story for Mock Service Worker https://jira.walmart.com/browse/INTLSAOPS-10057
  // TODO Skipping this test as ENOTFOUND occurs for non GET & POST requests ^^
  it.skip('ensures that the put - save function calls correctly', async () => {
    const saveLocations = SaveAuditsProgressService.saveAuditLocations;
    const putRequestSpy = jest.spyOn(Request, 'put');

    await saveLocations({ itemNbr: 2, locations: [{ name: 'ABAR1-1', qty: 535 }] });

    expect(putRequestSpy).toHaveBeenCalled();
  });

  it('calls getAuditLocations', async () => {
    const getAudLoc = SaveAuditsProgressService.getAuditLocations;
    const mockResponse = { data: {}, status: 200, statusText: 'ok' } as AxiosResponse;
    const getRequestSpy = jest.spyOn(Request, 'get');
    getRequestSpy.mockResolvedValue(mockResponse);
    const urls = getEnvironment();

    const getAudLocResponse = await getAudLoc({ itemNbr: 123, hours: 5 });
    expect(getRequestSpy).toHaveBeenCalledWith(
      `${urls.worklistURL}/worklist/audits/locations/${123}?timelimit=5`,
      undefined,
      { timeout: 30000 }
    );
    expect(getAudLocResponse).toStrictEqual(mockResponse);

    getAudLoc({ itemNbr: 456 });
    expect(getRequestSpy).toHaveBeenCalledWith(
      `${urls.worklistURL}/worklist/audits/locations/${456}`,
      undefined,
      { timeout: 30000 }
    );
  });
});
