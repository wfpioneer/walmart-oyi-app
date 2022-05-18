import User from '../models/User';
import { mockConfig } from './mockConfig';

const mockUser: User = {
  userId: 'testUser123',
  additional: {
    clockCheckResult: 'yes',
    displayName: 'test user',
    loginId: 'testUser123',
    mailId: 'testUser123@homeoffice.wal-mart.com'
  },
  configs: mockConfig,
  countryCode: 'US',
  domain: 'Home Office',
  features: [],
  siteId: 6233,
  token: 'fakeToken'
};

export default mockUser;
