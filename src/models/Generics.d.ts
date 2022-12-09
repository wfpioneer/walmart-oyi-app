import { EffectCallback } from 'react';

export type UseStateType<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type UseEffectType = (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;

/**
 * Helper type for bringing track event information from the parent screen
 * into components where the component accepts user interaction for the parent screen
 */
export type TrackEventSource = {
  screen: string;
  action: string;
  otherInfo?: any;
};
