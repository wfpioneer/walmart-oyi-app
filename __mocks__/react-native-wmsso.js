export default {
  getUser: jest.fn(() => Promise.resolve({
    userId: 'vn12345',
    token: 'blah',
    countryCode: 'US',
    domain: 'WMT',
    siteId: 6233,
    additional: {
      displayName: 'Test Testerson',
      clockCheckResult: 'pass',
      loginId: 'vn12345',
      mailId: 'vn12345@homeoffice.wal-mart.com'
    }
  }))
};
