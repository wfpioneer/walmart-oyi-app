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
        totalItems: 14,
        completedItems: 0
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 0
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 0
      }
    ],
    totalItems: 196,
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
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 4
      }
    ],
    totalItems: 196,
    totalCompletedItems: 98
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
        totalItems: 24,
        completedItems: 24
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 8
      }
    ],
    totalItems: 196,
    totalCompletedItems: 196
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
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 4
      }
    ],
    totalItems: 196,
    totalCompletedItems: 98
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

export const mockItemNPalletNAuditWorklistSummary: WorklistSummary[] = [
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
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 4
      }
    ],
    totalItems: 196,
    totalCompletedItems: 98
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
  },
  {
    totalCompletedItems: 80,
    totalItems: 151,
    worklistEndGoalPct: 100,
    worklistGoal: WorklistGoal.AUDITS,
    worklistGoalDuration: WorklistGoalDuration.DAILY,
    worklistGoalPct: 60,
    worklistTypes: [
      { worklistType: 'AU', totalItems: 20, completedItems: 6 },
      { worklistType: 'RA', totalItems: 5, completedItems: 5 }
    ]
  }
];
