import 'react-native-gesture-handler/jestSetup';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import '@testing-library/jest-dom';
import '@testing-library/jest-native/extend-expect';
import { cleanup, configure } from '@testing-library/react-native';

jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  Reanimated.default.addWhitelistedUIProps = jest.fn();

  return Reanimated;
});

// Increasing the Default timeout of "waitFor" and "findBy" queries from the testing-library
configure({ asyncUtilTimeout: 10000 });

// eslint-disable-next-line no-underscore-dangle
global.__reanimatedWorkletInit = jest.fn();

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Sets Moment to use the Same Timezone for Tests
const moment = jest.requireActual('moment-timezone');
moment.tz.setDefault('America/Chicago');
jest.setMock('moment', moment);
process.env.TZ = 'America/Chicago';

// Unmounts React trees that were mounted with the `testing-library's` render method
afterEach(() => {
  cleanup();
});
