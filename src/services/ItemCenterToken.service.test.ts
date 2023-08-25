import Request from './Request';
import ItmCenterTokenService from './ItemCenterToken.service';

describe('SaveAuditProgress Service Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TODO refactor test Spike story for Mock Service Worker
  it('ensures that the put - save function calls correctly', () => {
    const { getItemCenterToken } = ItmCenterTokenService;
    const postRequestSpy = jest.spyOn(Request, 'post');
    getItemCenterToken();
    expect(postRequestSpy).toHaveBeenCalled();
  });
});
