import { useTimeout } from '@mantine/hooks';
import { useState } from 'react';

export type UseDebugQueryResult<T> = {
    data: T | undefined;
    isLoading: boolean;
};

export function useDebugQuery<T>(data: T, delayMs = 500): UseDebugQueryResult<T> {
    const [isLoading, setIsLoading] = useState(true);

    useTimeout(() => setIsLoading(false), delayMs, { autoInvoke: true });

    return {
        data: isLoading ? undefined : data,
        isLoading
    };
}
