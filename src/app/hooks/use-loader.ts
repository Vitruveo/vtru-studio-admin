import { useState } from 'react';

export const useLoader = () => {
    const [isLoading, setIsLoading] = useState(false);

    const start = () => {
        setIsLoading(true);
    };
    const stop = () => {
        setIsLoading(false);
    };

    return { isLoading, start, stop };
};
