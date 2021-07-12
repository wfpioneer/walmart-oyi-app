import { WorklistSummary } from '../models/WorklistSummary';

export const mockWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: 'DAILY',
    worklistGoalPct: 0,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 0
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 0
      },
      {
        worklistType: 'NO',
        totalItems: 13,
        completedItems: 0
      }
    ],
    totalItems: 163,
    totalCompletedItems: 0
  }
];
