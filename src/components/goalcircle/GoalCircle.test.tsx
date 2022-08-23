import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import GoalCircle from './GoalCircle';
import { COLOR } from '../../themes/Color';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

describe('GoalCircle Component', () => {
  it('Renders an GoalCircle  with goal tiltle, active as false and completion perc 40', () => {
    const { toJSON } = render(
      <GoalCircle
        goalTitle="Test"
        completionGoal={100}
        completionPercentage={40}
        active={false}
        frequency="70"
        onPress={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders an GoalCircle with goal tiltle, active as false and completion perc 100', () => {
    const { toJSON, getByTestId } = render(
      <GoalCircle
        goalTitle="Test"
        completionGoal={100}
        completionPercentage={100}
        active={false}
        frequency="70"
        onPress={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
    const textComp = getByTestId('txtGoalTitle');
    expect(textComp.props.style.backgroundColor).toBe(COLOR.GREY_300);
  });

  it('Renders an GoalCircle  with goal tiltle, active as true and completion perc 100', () => {
    const { getByTestId, toJSON } = render(
      <GoalCircle
        goalTitle="Test"
        completionGoal={100}
        completionPercentage={100}
        active={true}
        frequency="70"
        onPress={jest.fn()}
      />
    );
    expect(toJSON()).toMatchSnapshot();
    const textComp = getByTestId('txtGoalTitle');
    expect(textComp.props.style.backgroundColor).toBe(COLOR.TRAINING_BLUE);
  });

  it('should call mock function on click of goal title', () => {
    const mockGoalClick = jest.fn();
    const { getByTestId } = render(
      <GoalCircle
        goalTitle="Test"
        completionGoal={100}
        completionPercentage={100}
        active={true}
        frequency="70"
        onPress={mockGoalClick}
      />
    );
    const btnGoalTitleClick = getByTestId('btnGoalTitleClick');
    fireEvent.press(btnGoalTitleClick);
    expect(mockGoalClick).toBeCalledTimes(1);
  });
});
