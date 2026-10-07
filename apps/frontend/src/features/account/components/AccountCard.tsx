import { Paper } from '@mantine/core';
import type { PropsWithChildren } from 'react';

type AccountCardProps = PropsWithChildren<{
    id?: string;
}>;

export function AccountCard({ id, children }: AccountCardProps) {
    return (
        <Paper withBorder id={id} className='rounded-xl p-6'>
            {children}
        </Paper>
    );
}
