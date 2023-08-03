import { fireEvent, render } from '@testing-library/react-native';
import AuditScreenFooter from './AuditScreenFooter';

describe('AuditScreenFooter Component', () => {
  it('Test renders AuditScreenFooter Screen with continue enabled', () => {
    const mockContinue = jest.fn();
    const { toJSON, getByTestId } = render(AuditScreenFooter({
      onContinueClick: mockContinue, disabledContinue: false
    }));

    const btnContinue = getByTestId('btnContinue');

    fireEvent.press(btnContinue);
    expect(mockContinue).toHaveBeenCalledWith();
    expect(toJSON()).toMatchSnapshot();
  });
  it('Test renders AuditScreenFooter Screen with continue disabled', () => {
    const mockContinue = jest.fn();
    const { toJSON } = render(AuditScreenFooter({
      onContinueClick: mockContinue, disabledContinue: true
    }));
    expect(toJSON()).toMatchSnapshot();
  });
});
