import { Button, Paper, Stack, Text, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router';
import { appRoutes } from '@/lib/routes';

type CheckoutNoticeProps = PropsWithChildren<{
    title: string;
}>;

export function CheckoutNotice({ title, children }: CheckoutNoticeProps) {
    return (
        <Paper withBorder className='rounded-xl p-6'>
            <Stack className='items-start gap-3'>
                <Title order={2} className='text-[21px] leading-normal font-semibold'>
                    {title}
                </Title>
                <Text className='text-sm text-dimmed'>{children}</Text>
                <Button component={Link} to={appRoutes.home} size='md' className='mt-2'>
                    Wróć do produktów
                </Button>
            </Stack>
        </Paper>
    );
}
