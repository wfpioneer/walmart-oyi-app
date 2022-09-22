import React from 'react';
import { render } from '@testing-library/react-native';
import OtherOHItemCard from './OtherOHItemCard';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcon');

describe('Tests OtherOHItemCard Component', () => {
  it('should tests redering OtherOHItemCard with other OH Qty props', async () => {
    const { toJSON } = render(
      <OtherOHItemCard
        flyCloudInTransitOH={5}
        flyCloudOH={3}
        claimsOH={5}
        consolidatorOH={2}
        loading={false}
        collapsed={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests rendering OtherOHItemCard in collpased state', async () => {
    const { toJSON } = render(
      <OtherOHItemCard
        flyCloudInTransitOH={5}
        flyCloudOH={3}
        claimsOH={5}
        consolidatorOH={2}
        loading={false}
        collapsed={true}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests rendering OtherOHItemCard while loading', async () => {
    const { toJSON } = render(
      <OtherOHItemCard
        flyCloudInTransitOH={5}
        flyCloudOH={3}
        claimsOH={5}
        consolidatorOH={2}
        loading={true}
        collapsed={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
