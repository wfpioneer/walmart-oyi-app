export default {
  validateSession: jest.fn(() => Promise.resolve())
};

export const sessionEnd = jest.fn();
