import { useState } from 'react';

export const useArray = <T extends string | number>(initialArray: T[]) => {
    const [state, setState] = useState(initialArray);

    const push = (element: T) => {
        setState((prev) => [...prev, element]);
    };

    const removeByValue = (value: T) => {
        setState((prev) => prev.filter((element) => element !== value));
    };

    const clear = () => {
        setState([]);
    };

    return { state, push, removeByValue, clear, setState };
};
