import { Alert } from '@mantine/core';
import type { ReactNode } from 'react';
import { Spinner } from '@/components/Spinner';

type QueryResultProps<T> = {
    data: T | null | undefined;
    isLoading: boolean;
    error: { message: string } | null;
    errorText?: string;
    children: (data: T) => ReactNode;
};

export function QueryResult<T>({
    data,
    isLoading,
    error,
    errorText = 'Nie udało się pobrać danych',
    children
}: QueryResultProps<T>) {
    if (isLoading) return <Spinner />;

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
