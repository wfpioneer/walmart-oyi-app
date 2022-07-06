import React from 'react';
import { render } from '@testing-library/react-native';
import WorklistHeader from './WorklistHeader';

describe('WorklistHeader Component', () => {
  test('Test worklistHeader component snaphsot', () => {
    const {
      toJSON
    } = render(<WorklistHeader title="A1-12" numberOfItems={15} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
