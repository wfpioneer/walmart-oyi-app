import React from 'react';
import AuditWorklistTab from '../AuditWorklistTab';

export const CompletedAuditWorklistScreen = () => <AuditWorklistTab toDo={false} />;
const CompletedAuditWorklist = () => <CompletedAuditWorklistScreen />;

export default CompletedAuditWorklist;
