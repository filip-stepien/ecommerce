import { Alert, Text } from '@mantine/core';
import type { ReactNode } from 'react';

type QueryResultProps<T> = {
    data: T | null | undefined;
    isLoading: boolean;
    error: { message: string } | null;
    loadingText?: string;
    errorText?: string;
    children: (data: T) => ReactNode;
};

export function QueryResult<T>({
    data,
    isLoading,
    error,
    loadingText = 'Ładowanie...',
    errorText = 'Nie udało się pobrać danych',
    children
}: QueryResultProps<T>) {
    if (isLoading) return <Text className='text-dimmed'>{loadingText}</Text>;

    if (error) {
        return (
            <Alert color='red' title={errorText}>
                {error.message}
            </Alert>
        );
    }

    if (data === null || data === undefined) return null;

    return children(data);
}
