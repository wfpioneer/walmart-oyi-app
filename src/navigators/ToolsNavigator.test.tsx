import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));

describe('Tools Navigator', () => {

});
