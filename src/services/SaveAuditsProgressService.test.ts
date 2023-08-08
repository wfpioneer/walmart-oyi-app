import Request from './Request';
import SaveAuditsProgressService from './SaveAuditsProgress.service';

describe('Save Audits Progress services tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('ensures that the put - save function calls correctly', () => {
    const saveLocations = SaveAuditsProgressService.saveAuditLocations;
    const putRequestSpy = jest.spyOn(Request, 'put');

    saveLocations({ itemNbr: 2, locations: [{ name: 'ABAR1-1', qty: 535 }] });

    expect(putRequestSpy).toHaveBeenCalled();
  });
});
