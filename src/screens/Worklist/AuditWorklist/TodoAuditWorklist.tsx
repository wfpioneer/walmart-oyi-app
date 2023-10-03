import React from 'react';
import AuditWorklistTab from '../AuditWorklistTab';
import { WorklistItemI } from '../../../models/WorklistItem';

export interface TodoAuditWorklistScreenProps {
  onRefresh: () => void;
  auditWorklistItems: WorklistItemI[];
}

export interface TodoAuditWorklistProps {
  onRefresh: () => void;
  auditWorklistItems: WorklistItemI[];
}

export const TodoAuditWorklistScreen = (props: TodoAuditWorklistScreenProps) => {
  const { onRefresh, auditWorklistItems } = props;
  return (
    <AuditWorklistTab completionLevel={0} onRefresh={onRefresh} auditWorklistItems={auditWorklistItems} />
  );
};

const TodoAuditWorklist = (props: TodoAuditWorklistProps) => {
  const { onRefresh, auditWorklistItems } = props;
  return (
    <TodoAuditWorklistScreen onRefresh={onRefresh} auditWorklistItems={auditWorklistItems} />
  );
};

export default TodoAuditWorklist;
