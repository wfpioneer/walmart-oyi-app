import { fireEvent, render } from '@testing-library/react-native';
import CollapseAllBar from './CollapseAllBar';

describe('CollapseAllBar Component', () => {
  it('Test renders default CollapseAllBar with collapsed as false', () => {
    const mockOnclick = jest.fn();
    const { toJSON, getByTestId } = render(CollapseAllBar({ collapsed: false, onclick: mockOnclick }));

    const btnCollapse = getByTestId('collapse-text-btn');

    fireEvent.press(btnCollapse);
    expect(mockOnclick).toHaveBeenCalledWith(true);
    expect(toJSON()).toMatchSnapshot();
  });
  it('Test renders default CollapseAllBar with collapsed as true', () => {
    const mockOnclick = jest.fn();
    const { toJSON, getByTestId } = render(CollapseAllBar({ collapsed: true, onclick: mockOnclick }));

    const btnCollapse = getByTestId('collapse-text-btn');

    fireEvent.press(btnCollapse);
    expect(mockOnclick).toHaveBeenCalledWith(false);
    expect(toJSON()).toMatchSnapshot();
  });
});
