export interface WorklistSummary {
  worklistGoal: 'DAILY' | 'WEEKLY',
  worklistGoalPct: number,
  worklistTypes: WorklistTypeSummary[],
  totalItems: number,
  totalCompletedItems: number
}

export interface WorklistTypeSummary {
  worklistType: 'NSFL' | 'C' | 'NO' | 'NS' | 'NP' | 'PO',
  totalItems: number,
  completedItems: number
}
