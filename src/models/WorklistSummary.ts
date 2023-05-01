// eslint-disable-next-line no-shadow
export enum WorklistGoal {
  ITEMS = 'ITEMS',
  PALLETS = 'PALLETS',
  AUDITS = 'AUDITS'
}

export interface WorklistSummary {
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
  completedItems: number,
  inProgressItems: number,
  todoItems: number
}

export type WorklistType = 'NSFL' | 'C' | 'NO' | 'NS' | 'NP' | 'PO' | 'MP' | 'AU' | 'RA' | 'NSFQ' | 'CATEGORY';
