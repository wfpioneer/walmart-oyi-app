export interface WorklistSummary {
  worklistGoal: 'DAILY' | 'WEEKLY',
  worklistGoalPct: number,
  worklistTypes: WorklistType[],
  totalItems: number,
  totalCompletedItems: number
}

export interface WorklistType {
  worklistType: 'NSFL' | 'C' | 'NO' | 'NS' | 'NP' | 'PO',
  totalItems: number,
  completedItems: number
}
