import { Alert } from '@mantine/core';
import type { ReactNode } from 'react';
import { Spinner } from '@/components/Spinner';

type QueryResultProps<T> = {
    data: T | null | undefined;
    isLoading: boolean;
    error: { message: string } | null;
    errorText?: string;
    loader?: ReactNode;
    children: (data: T) => ReactNode;
};

export function QueryResult<T>({
    data,
    isLoading,
    error,
    errorText = 'Nie udało się pobrać danych',
    loader = <Spinner />,
    children
}: QueryResultProps<T>) {
    if (isLoading) return loader;

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
