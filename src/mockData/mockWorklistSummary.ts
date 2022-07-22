import { WorklistGoal, WorklistGoalDuration, WorklistSummary } from '../models/WorklistSummary';

export const mockZeroCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalDuration: WorklistGoalDuration.DAILY,
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
      },
      {
        worklistType: 'NS',
        totalItems: 0,
        completedItems: 0
      }
    ],
    totalItems: 163,
    totalCompletedItems: 0
  }
];

export const mockHalfCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalDuration: WorklistGoalDuration.DAILY,
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
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 12
      }
    ],
    totalItems: 188,
    totalCompletedItems: 94
  }
];

export const mockAllCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalDuration: WorklistGoalDuration.DAILY,
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
      },
      {
        worklistType: 'NS',
        totalItems: 20,
        completedItems: 20
      }
    ],
    totalItems: 184,
    totalCompletedItems: 184
  }
];

export const mockMissingPalletWorklistSummary : WorklistSummary[] = [{
  totalCompletedItems: 1,
  totalItems: 151,
  worklistEndGoalPct: 100,
  worklistGoal: WorklistGoal.PALLETS,
  worklistGoalDuration: WorklistGoalDuration.DAILY,
  worklistGoalPct: 1,
  worklistTypes: [
    { worklistType: 'MP', totalItems: 0, completedItems: 0 }
  ]
}];

export const mockItemAndPalletWorklistSummary: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalDuration: WorklistGoalDuration.DAILY,
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
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 12
      }
    ],
    totalItems: 188,
    totalCompletedItems: 94
  },
  {
    totalCompletedItems: 1,
    totalItems: 151,
    worklistEndGoalPct: 100,
    worklistGoal: WorklistGoal.PALLETS,
    worklistGoalDuration: WorklistGoalDuration.DAILY,
    worklistGoalPct: 1,
    worklistTypes: [
      { worklistType: 'MP', totalItems: 0, completedItems: 0 }
    ]
  }
];
