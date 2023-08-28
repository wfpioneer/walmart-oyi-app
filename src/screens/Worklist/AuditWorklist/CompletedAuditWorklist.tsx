import React from 'react';
import AuditWorklistTab from '../AuditWorklistTab';
import { WorklistItemI } from '../../../models/WorklistItem';

export interface CompletedAuditWorklistScreenProps {
  onRefresh: () => void;
  auditWorklistItems: WorklistItemI[];
}

export interface CompletedAuditWorklistProps {
  onRefresh: () => void;
  auditWorklistItems: WorklistItemI[];
}

export const CompletedAuditWorklistScreen = (props: CompletedAuditWorklistScreenProps) => {
  const { onRefresh, auditWorklistItems } = props;
  return (
    <AuditWorklistTab completionLevel={2} onRefresh={onRefresh} auditWorklistItems={auditWorklistItems} />
  );
};

const CompletedAuditWorklist = (props: CompletedAuditWorklistProps) => {
  const { onRefresh, auditWorklistItems } = props;
  return (
    <CompletedAuditWorklistScreen onRefresh={onRefresh} auditWorklistItems={auditWorklistItems} />
  );
};

export default CompletedAuditWorklist;
