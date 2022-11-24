import React from "react";
import {debounceTime, Subject} from "rxjs";

export function useDebouncedState<T = any>(time: number, initValue: T): [T, (v: T) => void] {
    const [value, setValue] = React.useState<T>(initValue);
    const [value$] = React.useState(() => new Subject<T>());
    React.useEffect(() => {
        const subscription = value$.pipe(
            debounceTime(time)
        ).subscribe(setValue);
        return () => subscription.unsubscribe();
    }, [time, value$]);
    return [value, (v: T) => value$.next(v)];
}
