import { fireEvent, render } from '@testing-library/react-native';
import AuditScreenFooter from './AuditScreenFooter';

describe('AuditScreenFooter Component', () => {
  const mockContinue = jest.fn();
  const mockSave = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Test renders AuditScreenFooter Screen with continue enabled', () => {
    const { toJSON, getByTestId } = render(AuditScreenFooter({
      onContinueClick: mockContinue, disabledContinue: false, onSaveClick: mockSave, showSaveButton: false
    }));

    const btnContinue = getByTestId('btnContinue');

    fireEvent.press(btnContinue);
    expect(mockContinue).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
  it('Test renders AuditScreenFooter Screen with continue disabled', () => {
    const { toJSON } = render(AuditScreenFooter({
      onContinueClick: mockContinue, disabledContinue: true, onSaveClick: mockSave, showSaveButton: false
    }));
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the footer with save set to true', () => {
    const { toJSON, getByTestId } = render(AuditScreenFooter({
      onContinueClick: mockContinue, disabledContinue: false, onSaveClick: mockSave, showSaveButton: true
    }));

    const btnSave = getByTestId('btnSave');

    fireEvent.press(btnSave);
    expect(mockSave).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });
});
