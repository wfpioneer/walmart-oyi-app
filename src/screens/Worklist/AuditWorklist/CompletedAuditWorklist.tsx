import React from 'react';
import AuditWorklistTab from '../AuditWorklistTab';

export interface CompletedAuditWorklistScreenProps {
  onRefresh: () => void;
}

export interface CompletedAuditWorklistProps {
  onRefresh: () => void;
}

export const CompletedAuditWorklistScreen = (props: CompletedAuditWorklistScreenProps) => {
  const { onRefresh } = props;
  return (
    <AuditWorklistTab toDo={false} onRefresh={onRefresh} />
  );
};

const CompletedAuditWorklist = (props: CompletedAuditWorklistProps) => {
  const { onRefresh } = props;
  return (
    <CompletedAuditWorklistScreen onRefresh={onRefresh} />
  );
};

export default CompletedAuditWorklist;
