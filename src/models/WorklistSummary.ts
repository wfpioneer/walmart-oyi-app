export interface WorklistSummary {
  worklistGoal: 'DAILY' | 'WEEKLY',
  worklistGoalPct: number,
  worklistTypes: WorklistTypeDetails[],
  totalItems: number,
  totalCompletedItems: number
}

export interface WorklistTypeDetails {
  worklistType: 'NSFL' | 'C' | 'NO' | 'NS' | 'NP' | 'PO',
  totalItems: number,
  completedItems: number
}
