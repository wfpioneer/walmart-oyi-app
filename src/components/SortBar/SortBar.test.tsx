import { fireEvent, render } from '@testing-library/react-native';
import SortBar from './SortBar';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'mockMaterialIcons');

describe('SortBar Component', () => {
  it('Test renders default PalletWorkList Screen', () => {
    const mockUpdateToggle = jest.fn();
    const { toJSON, getByTestId } = render(SortBar(false, mockUpdateToggle));

    const menuToggle = getByTestId('menu');
    const listToggle = getByTestId('list');

    fireEvent.press(menuToggle);
    expect(mockUpdateToggle).toHaveBeenCalledWith(false);

    fireEvent.press(listToggle);
    expect(mockUpdateToggle).toHaveBeenCalledWith(true);
    expect(toJSON()).toMatchSnapshot();
  });
});
