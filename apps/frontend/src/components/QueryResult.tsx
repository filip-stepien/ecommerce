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
    if (isLoading) return <p>{loadingText}</p>;

    if (error) {
        return (
            <p role='alert'>
                {errorText}: {error.message}
            </p>
        );
    }

    if (data === null || data === undefined) return null;

    return children(data);
}
