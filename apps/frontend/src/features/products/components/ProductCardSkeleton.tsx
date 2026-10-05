import { Paper, Skeleton, Stack } from '@mantine/core';

export function ProductCardSkeleton() {
    return (
        <Paper withBorder shadow='xs' className='rounded-lg p-[23px]'>
            <Stack className='gap-[17px]'>
                <Skeleton className='h-[173px] rounded-[5px]' />
                <Skeleton className='h-[28px] w-3/4' />
                <Skeleton className='h-[35px] w-1/3' />
                <Skeleton className='h-[42px] w-45' />
            </Stack>
        </Paper>
    );
}
