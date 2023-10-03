import { WorklistGoal, WorklistSummary } from '../models/WorklistSummary';

export const mockZeroCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalPct: 0,
    worklistEndGoalPct: 90,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 0,
        inProgressItems: 0,
        todoItems: 100
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 0,
        inProgressItems: 0,
        todoItems: 50
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 0,
        inProgressItems: 0,
        todoItems: 13
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 0,
        inProgressItems: 0,
        todoItems: 24
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 0,
        inProgressItems: 0,
        todoItems: 8
      }
    ],
    totalItems: 196,
    totalCompletedItems: 0
  }
];

export const mockHalfCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalPct: 50,
    worklistEndGoalPct: 100,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 50,
        inProgressItems: 0,
        todoItems: 50
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 25,
        inProgressItems: 0,
        todoItems: 25
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 7,
        inProgressItems: 0,
        todoItems: 7
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 12,
        inProgressItems: 0,
        todoItems: 12
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 4,
        inProgressItems: 0,
        todoItems: 4
      }
    ],
    totalItems: 196,
    totalCompletedItems: 98
  }
];

export const mockAllCompleteWorklistSummaries: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalPct: 100,
    worklistEndGoalPct: 95,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 100,
        inProgressItems: 0,
        todoItems: 0
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 50,
        inProgressItems: 0,
        todoItems: 0
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 14,
        inProgressItems: 0,
        todoItems: 0
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 24,
        inProgressItems: 0,
        todoItems: 0
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 8,
        inProgressItems: 0,
        todoItems: 0
      }
    ],
    totalItems: 196,
    totalCompletedItems: 196
  }
];

export const mockMissingPalletWorklistSummary: WorklistSummary[] = [
  {
    totalCompletedItems: 1,
    totalItems: 151,
    worklistEndGoalPct: 100,
    worklistGoal: WorklistGoal.PALLETS,
    worklistGoalPct: 1,
    worklistTypes: [{
      worklistType: 'MP',
      totalItems: 151,
      completedItems: 0,
      inProgressItems: 0,
      todoItems: 151
    }]
  }
];

export const mockItemAndPalletWorklistSummary: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalPct: 50,
    worklistEndGoalPct: 100,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 50,
        inProgressItems: 0,
        todoItems: 50
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 25,
        inProgressItems: 0,
        todoItems: 25
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 7,
        inProgressItems: 0,
        todoItems: 7
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 12,
        inProgressItems: 0,
        todoItems: 12
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 4,
        inProgressItems: 0,
        todoItems: 4
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
    worklistGoalPct: 1,
    worklistTypes: [{
      worklistType: 'MP',
      totalItems: 151,
      completedItems: 0,
      inProgressItems: 0,
      todoItems: 151
    }]
  }
];

export const mockItemNPalletNAuditWorklistSummary: WorklistSummary[] = [
  {
    totalCompletedItems: 98,
    totalItems: 196,
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalPct: 50,
    worklistEndGoalPct: 100,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 50,
        inProgressItems: 0,
        todoItems: 50
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 25,
        inProgressItems: 0,
        todoItems: 25
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 7,
        inProgressItems: 0,
        todoItems: 7
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 12,
        inProgressItems: 0,
        todoItems: 12
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 4,
        inProgressItems: 0,
        todoItems: 4
      }
    ]
  },
  {
    totalCompletedItems: 1,
    totalItems: 151,
    worklistEndGoalPct: 100,
    worklistGoal: WorklistGoal.PALLETS,
    worklistGoalPct: 1,
    worklistTypes: [{
      worklistType: 'MP',
      totalItems: 151,
      completedItems: 1,
      inProgressItems: 0,
      todoItems: 151
    }]
  },
  {
    totalCompletedItems: 11,
    totalItems: 25,
    worklistEndGoalPct: 100,
    worklistGoal: WorklistGoal.AUDITS,
    worklistGoalPct: 44,
    worklistTypes: [
      {
        worklistType: 'AU',
        totalItems: 20,
        completedItems: 6,
        inProgressItems: 0,
        todoItems: 14
      },
      {
        worklistType: 'RA',
        totalItems: 5,
        completedItems: 5,
        inProgressItems: 0,
        todoItems: 0
      }
    ]
  }
];

export const badDataCombinedWorklistSummary: WorklistSummary[] = [
  {
    worklistGoal: WorklistGoal.ITEMS,
    worklistGoalPct: 50,
    worklistEndGoalPct: 100,
    worklistTypes: [
      {
        worklistType: 'NSFL',
        totalItems: 100,
        completedItems: 50,
        inProgressItems: 0,
        todoItems: 50
      },
      {
        worklistType: 'C',
        totalItems: 50,
        completedItems: 25,
        inProgressItems: 26,
        todoItems: 0
      },
      {
        worklistType: 'NS',
        totalItems: 24,
        completedItems: 36,
        inProgressItems: 0,
        todoItems: 0
      },
      {
        worklistType: 'NSFQ',
        totalItems: 8,
        completedItems: 4,
        inProgressItems: 0,
        todoItems: 4
      },
      {
        worklistType: 'NO',
        totalItems: 14,
        completedItems: 13,
        inProgressItems: 0,
        todoItems: 7
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
    worklistGoalPct: 1,
    worklistTypes: [{
      worklistType: 'MP',
      totalItems: 151,
      completedItems: 1,
      inProgressItems: 0,
      todoItems: 124
    }]
  },
  {
    totalCompletedItems: 6,
    totalItems: 20,
    worklistEndGoalPct: 100,
    worklistGoal: WorklistGoal.AUDITS,
    worklistGoalPct: 30,
    worklistTypes: [
      {
        worklistType: 'AU',
        totalItems: 20,
        completedItems: 6,
        inProgressItems: 0,
        todoItems: 14
      },
      {
        worklistType: 'RA',
        totalItems: 0,
        completedItems: -5,
        inProgressItems: 0,
        todoItems: 0
      }
    ]
  }
];
