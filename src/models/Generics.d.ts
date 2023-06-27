import { EventArg } from '@react-navigation/native';
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

export type BeforeRemoveEvent = EventArg<'beforeRemove', true, {
  action: Readonly<{
      type: string;
      payload?: object | undefined;
      source?: string | undefined;
      target?: string | undefined;
  }>;
}>;

export type ScannedEvent = {
  value: any;
  type: string | null;
};
