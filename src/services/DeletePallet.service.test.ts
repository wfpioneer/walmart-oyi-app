import { getEnvironment } from '../utils/environment';
import Request from './Request';
import DeletePalletService from './DeletePallet.service';

// TODO Skipping this test as ENOTFOUND occurs for non GET & POST requests https://jira.walmart.com/browse/INTLSAOPS-10057
describe.skip('Delete Pallet Service Tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  const {
    deletePalletUPCs, deleteBadPallet, deletePalletFromSection, clearPallet
  } = DeletePalletService;

  // TODO refactor test Spike story for Mock Service Worker https://jira.walmart.com/browse/INTLSAOPS-10057
  it('ensures that the deletePalletUPCs function calls correctly', async () => {
    const deleteRequestSpy = jest.spyOn(Request, 'delete');
    const urls = getEnvironment();
    const mockUpcParam = ['321, 456'];
    const baseUrl = `${urls.locationUrl}/pallet/123/upc?`;

    await deletePalletUPCs({
      palletId: '123',
      upcs: mockUpcParam,
      expirationDate: '',
      removeExpirationDate: true
    });
    expect(deleteRequestSpy).toHaveBeenCalledWith(`${baseUrl}upcs=321, 456`, {
      expirationDate: '',
      removeExpirationDate: true
    });
    deleteRequestSpy.mockClear();
  });

  it('ensures that the deleteBadPallet api function is called correctly', async () => {
    const deleteRequestSpy = jest.spyOn(Request, 'delete');
    const urls = getEnvironment();
    const mockPalletId = '123';

    await deleteBadPallet({ palletId: mockPalletId });
    const baseUrl = `${urls.locationUrl}/picklist/pallet/${mockPalletId}`;

    expect(deleteRequestSpy).toHaveBeenCalledWith(baseUrl);
  });

  it('ensures that the deletePalletFromSection api function is called correctly', async () => {
    const deleteRequestSpy = jest.spyOn(Request, 'delete');
    const urls = getEnvironment();
    const mockPalletId = '123';

    await deletePalletFromSection({ palletId: mockPalletId });
    const baseUrl = `${urls.locationUrl}/pallet/${mockPalletId}/section`;

    expect(deleteRequestSpy).toHaveBeenCalledWith(baseUrl, undefined);
  });

  it('ensures that the clearPallet api function is called correctly', async () => {
    const deleteRequestSpy = jest.spyOn(Request, 'delete');
    const urls = getEnvironment();
    const mockPalletId = '123';

    await clearPallet({ palletId: mockPalletId });
    const baseUrl = `${urls.orchestrationURL}/pallet/${mockPalletId}`;

    expect(deleteRequestSpy).toHaveBeenCalledWith(baseUrl);
  });
});
