import SaveAuditsProgressService from './SaveAuditsProgress.service';
import { putMock } from './__mocks__/Request';

jest.mock('./Request');
jest.mock('../state/index');
jest.mock('../utils/environment', () => ({
  ...jest.requireActual('../utils/environment'),
  getEnvironment: jest.fn(() => ({
    pingFedURL: 'https://pfeddev.wal-mart.com',
    orchestrationURL: 'https://intl-oyi-orchestration-api.$cn.dev.walmart.com',
    itemDetailsURL: 'https://intl-oyi-item-details-api.cn.dev.walmart.com',
    worklistURL: 'https://intl-oyi-worklist-api.cn.dev.walmart.com',
    fluffyURL: 'https://api-proxy.stg.soa-api-proxy.platform.glb.prod.walmart.com'
      + '/api-proxy/service/IntlMobileAuthorizationPlatform',
    locationUrl: 'https://intl-oyi-location-api.cn.dev.walmart.com',
    printingUrl: 'https://intl-oyi-printing-api.cn.dev.walmart.com',
    configUrl: 'https://intl-oyi-config-api.cn.dev.walmart.com',
    itemImageUUIDUrlCN: 'https://samsclubcnds.riversand.com/api/entityappservice/get',
    itemImageUrlCN: 'https://samsclubcnds.riversand.com/api/rsAssetService/getlinkedasseturl',
    atmtUrl: 'https://api.atmt-feedback.qa.walmart.com'
  }))
}));

describe('Save Audits Progress services tests', () => {
  it('ensures that the put - save function calls correctly', () => {
    SaveAuditsProgressService.saveAuditLocations({ itemNbr: 2, locations: [{ name: 'ABAR1-1', qty: 535 }] });

    expect(putMock).toHaveBeenCalled();
  });
});
