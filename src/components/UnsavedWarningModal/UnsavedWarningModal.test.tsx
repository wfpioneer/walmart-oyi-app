import { fireEvent, render } from '@testing-library/react-native';
import { renderUnsavedWarningModal } from './UnsavedWarningModal';

const mockSetState = jest.fn();
const mockOnConfirm = jest.fn();

describe('Unsaved warning modal render tests', () => {
  it('renders the warning modal', () => {
    const { toJSON, getByTestId } = render(renderUnsavedWarningModal(
      true,
      mockSetState,
      'yes',
      'no',
      mockOnConfirm
    ));

    const cancelBtn = getByTestId('cancelBack');
    const confirmBtn = getByTestId('confirmBack');

    fireEvent.press(cancelBtn);
    expect(mockSetState).toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();

    jest.resetAllMocks();

    fireEvent.press(confirmBtn);
    expect(mockSetState).not.toHaveBeenCalled();
    expect(mockOnConfirm).toHaveBeenCalled();

    expect(toJSON()).toMatchSnapshot();
  });

  it('does not render the warning modal', () => {
    const { toJSON } = render(renderUnsavedWarningModal(
      false,
      mockSetState,
      'yes',
      'nein',
      mockOnConfirm
    ));

    expect(toJSON()).toMatchSnapshot();
  });
});
