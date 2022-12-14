import { Configurations, area } from '../models/User';

export const mockAreas: area[] = [
  {
    area: 'CENTER',
    categories: [5, 7, 9, 11, 16]
  },
  {
    area: 'GM',
    categories: [23, 24, 28, 31]
  },
  {
    area: 'Fresh',
    categories: [41, 42, 43, 45, 47, 48]
  }
];

export const mockConfig: Configurations = {
  locationManagement: false,
  locationManagementEdit: false,
  palletManagement: false,
  settingsTool: false,
  printingUpdate: false,
  binning: false,
  palletExpiration: false,
  backupCategories: '',
  picking: false,
  areas: mockAreas,
  enableAreaFilter: false,
  palletWorklists: false,
  additionalItemDetails: false,
  createPallet: false,
  auditWorklists: false,
  showRollOverAudit: false,
  showOpenAuditLink: false,
  scanRequired: false,
  showCalculator: false,
  multiBin: false,
  multiPick: false,
  showItemImage: false
};
