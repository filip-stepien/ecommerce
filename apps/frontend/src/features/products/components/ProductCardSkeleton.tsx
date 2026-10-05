import { Paper, Skeleton, Stack } from '@mantine/core';

export function ProductCardSkeleton() {
    return (
        <Paper withBorder shadow='xs' className='rounded-lg p-4'>
            <Stack className='gap-3'>
                <Skeleton className='h-[173px] rounded-[5px]' />
                <Skeleton className='h-[22.5px] w-3/4' />
                <Skeleton className='h-[27.5px] w-1/3' />
                <Skeleton className='h-[42px]' />
            </Stack>
        </Paper>
    );
}
