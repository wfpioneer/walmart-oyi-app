import React from 'react';
import AuditWorklistTab from '../AuditWorklistTab';

export interface InProgressAuditWorklistScreenProps {
  onRefresh: () => void;
}

export interface InProgressAuditWorklistProps {
  onRefresh: () => void;
}

export const InProgressAuditWorklistScreen = (props: InProgressAuditWorklistScreenProps) => {
  const { onRefresh } = props;
  return (
    <AuditWorklistTab completionLevel={1} onRefresh={onRefresh} />
  );
};

const InProgressAuditWorklist = (props: InProgressAuditWorklistProps) => {
  const { onRefresh } = props;
  return (
    <InProgressAuditWorklistScreen onRefresh={onRefresh} />
  );
};

export default InProgressAuditWorklist;
