export const setEndTime = (sessionEnd: number) => ({
  type: 'SESSION/ENDTIME',
  payload: sessionEnd
} as const);

export const clearEndTime = () => ({
  type: 'SESSION/CLEAR'
} as const);

export type Actions =
  | ReturnType<typeof setEndTime>
  | ReturnType<typeof clearEndTime>;
