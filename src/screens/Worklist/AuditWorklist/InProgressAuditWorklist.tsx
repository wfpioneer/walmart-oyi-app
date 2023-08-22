import React from 'react';
import AuditWorklistTab from '../AuditWorklistTab';
import { WorklistItemI } from '../../../models/WorklistItem';

export interface InProgressAuditWorklistScreenProps {
  onRefresh: () => void;
  auditWorklistItems: WorklistItemI[];
}

export interface InProgressAuditWorklistProps {
  onRefresh: () => void;
  auditWorklistItems: WorklistItemI[];
}

export const InProgressAuditWorklistScreen = (props: InProgressAuditWorklistScreenProps) => {
  const { onRefresh, auditWorklistItems } = props;
  return (
    <AuditWorklistTab completionLevel={1} onRefresh={onRefresh} auditWorklistItems={auditWorklistItems} />
  );
};

const InProgressAuditWorklist = (props: InProgressAuditWorklistProps) => {
  const { onRefresh, auditWorklistItems } = props;
  return (
    <InProgressAuditWorklistScreen onRefresh={onRefresh} auditWorklistItems={auditWorklistItems} />
  );
};

export default InProgressAuditWorklist;
