import React from 'react';
import { render } from '@testing-library/react-native';
import InProgressAuditWorklist from './InProgressAuditWorklist';
import TodoAuditWorklist from './TodoAuditWorklist';
import CompletedAuditWorklist from './CompletedAuditWorklist';

jest.mock('../AuditWorklistTab', () => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const mocked = (props: any) => <div title="mockAuditWorklistTab" {...props} />;

  return mocked;
});

describe('Audit worklist render tests', () => {
  it('renders the todo tab', () => {
    const { toJSON } = render(<TodoAuditWorklist onRefresh={jest.fn()} auditWorklistItems={[]} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the in progress tab', () => {
    const { toJSON } = render(<InProgressAuditWorklist onRefresh={jest.fn()} auditWorklistItems={[]} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the completed tab', () => {
    const { toJSON } = render(<CompletedAuditWorklist onRefresh={jest.fn()} auditWorklistItems={[]} />);

    expect(toJSON()).toMatchSnapshot();
  });
});
