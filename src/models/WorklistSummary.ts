// eslint-disable-next-line no-shadow
export enum WorklistGoal {
  ITEMS = 'ITEMS',
  PALLETS = 'PALLETS',
  AUDITS = 'AUDITS'
}

// eslint-disable-next-line @typescript-eslint/no-shadow, no-shadow
export enum WorklistGoalDuration {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY'
}

export interface WorklistSummary {
  worklistGoalDuration: WorklistGoalDuration,
  worklistGoal: WorklistGoal,
  worklistGoalPct: number,
  worklistEndGoalPct: number,
  worklistTypes: WorklistTypeDetails[],
  totalItems: number,
  totalCompletedItems: number
}

export interface WorklistTypeDetails {
  worklistType: WorklistType,
  totalItems: number,
  completedItems: number
}

export type WorklistType = 'NSFL' | 'C' | 'NO' | 'NS' | 'NP' | 'PO' | 'MP' | 'AU' | 'RA';
