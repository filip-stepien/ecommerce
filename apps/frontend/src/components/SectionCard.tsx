import { Paper } from '@mantine/core';
import type { PropsWithChildren } from 'react';

type SectionCardProps = PropsWithChildren<{
    id?: string;
}>;

export function SectionCard({ id, children }: SectionCardProps) {
    return (
        <Paper withBorder id={id} className='rounded-xl p-6'>
            {children}
        </Paper>
    );
}
