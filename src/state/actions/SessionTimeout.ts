export const SESSION_ENDTIME = 'SESSION/ENDTIME';
export const SESSION_CLEAR = 'SESSION/CLEAR';

export const setEndTime = (sessionEnd: number) => ({
  type: SESSION_ENDTIME,
  payload: sessionEnd
} as const);

export const clearEndTime = () => ({
  type: SESSION_CLEAR
} as const);

export type Actions =
  | ReturnType<typeof setEndTime>
  | ReturnType<typeof clearEndTime>;
