import React from 'react';
import AuditWorklistTab from '../AuditWorklistTab';

export interface TodoAuditWorklistScreenProps {
  onRefresh: () => void;
}

export interface TodoAuditWorklistProps {
  onRefresh: () => void;
}

export const TodoAuditWorklistScreen = (props: TodoAuditWorklistScreenProps) => {
  const { onRefresh } = props;
  return (
    <AuditWorklistTab completionLevel={0} onRefresh={onRefresh} />
  );
};

const TodoAuditWorklist = (props: TodoAuditWorklistProps) => {
  const { onRefresh } = props;
  return (
    <TodoAuditWorklistScreen onRefresh={onRefresh} />
  );
};

export default TodoAuditWorklist;
