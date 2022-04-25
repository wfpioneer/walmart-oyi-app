import { EffectCallback } from 'react';

export type UseStateType<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type UseEffectType = (effect: EffectCallback, deps?: ReadonlyArray<any>) => void;
