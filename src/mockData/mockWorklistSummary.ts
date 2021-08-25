import { WorklistSummary } from '../models/WorklistSummary';

export const mockZeroCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: 'DAILY',
    worklistGoalPct: 0,
    worklistEndGoalPct: 90,
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

export const mockHalfCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: 'DAILY',
    worklistGoalPct: 50,
    worklistEndGoalPct: 100,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 50
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 25
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 7
      }
    ],
    totalItems: 164,
    totalCompletedItems: 82
  }
];

export const mockAllCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: 'DAILY',
    worklistGoalPct: 100,
    worklistEndGoalPct: 95,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 100
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 50
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 14
      }
    ],
    totalItems: 164,
    totalCompletedItems: 164
  }
];
