import { Paper, Stack, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';

type CheckoutSectionProps = PropsWithChildren<{
    title: string;
}>;

export function CheckoutSection({ title, children }: CheckoutSectionProps) {
    return (
        <Paper withBorder className='rounded-xl p-6'>
            <Stack className='gap-5'>
                <Title order={2} className='text-[21px] leading-normal font-semibold'>
                    {title}
                </Title>
                {children}
            </Stack>
        </Paper>
    );
}
