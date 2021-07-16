export interface WorklistSummary {
  worklistGoal: 'DAILY' | 'WEEKLY',
  worklistGoalPct: number,
  worklistTypes: WorklistTypeDetails[],
  totalItems: number,
  totalCompletedItems: number
}

export interface WorklistTypeDetails {
  worklistType: WorklistType,
  totalItems: number,
  completedItems: number
}

export type WorklistType = 'NSFL' | 'C' | 'NO' | 'NS' | 'NP' | 'PO';
