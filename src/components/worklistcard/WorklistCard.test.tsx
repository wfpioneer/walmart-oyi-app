import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import WorklistCard from './WorklistCard';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('testing OHQtyUpdate component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('render component and test buttons', () => {
    const mockHandleSubmit = jest.fn();
    it('render component with some test data and goal not as zero', () => {
      const { toJSON } = render(
        <WorklistCard
          goalTitle="Test"
          goal={100}
          complete={90}
          completionPercentage={90}
          completionGoal={100}
          onPress={mockHandleSubmit}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('render component with some test data and goal as zero', () => {
      const { toJSON } = render(
        <WorklistCard
          goalTitle="Test"
          goal={0}
          complete={90}
          completionPercentage={90}
          completionGoal={100}
          onPress={mockHandleSubmit}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
    it('should call mock func on card click', () => {
      const { getByTestId } = render(
        <WorklistCard
          goalTitle="Test"
          goal={70}
          complete={90}
          completionPercentage={90}
          completionGoal={100}
          onPress={mockHandleSubmit}
        />
      );
      const btnCard = getByTestId('btnCard');
      fireEvent.press(btnCard);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});
