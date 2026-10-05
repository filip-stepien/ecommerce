import { Divider, Flex, Group, Paper, Skeleton, Stack } from '@mantine/core';

const thumbnailCount = 4;
const specificationCount = 4;

export function ProductDetailsSkeleton() {
    return (
        <>
            <Flex className='flex-col gap-13 lg:flex-row'>
                <Stack className='w-full gap-4 lg:w-1/2'>
                    <Paper className='h-[460px] rounded-xl p-7.5'>
                        <Skeleton className='h-full rounded-lg' />
                    </Paper>
                    <Group className='gap-3'>
                        {Array.from({ length: thumbnailCount }, (_, index) => (
                            <Skeleton key={index} className='h-[86px] w-28 rounded-lg' />
                        ))}
                    </Group>
                </Stack>
                <Stack className='min-w-0 flex-1 gap-4.5'>
                    <Stack className='gap-1.5'>
                        <Skeleton className='h-[41px] w-2/3' />
                        <Skeleton className='h-[26px] w-1/2' />
                    </Stack>
                    <Divider />
                    <Stack className='gap-1'>
                        <Skeleton className='h-10 w-48' />
                        <Skeleton className='h-4 w-28' />
                    </Stack>
                    <Group className='gap-3.5'>
                        <Skeleton className='h-9 w-22' />
                        <Skeleton className='h-[42px] w-44' />
                    </Group>
                </Stack>
            </Flex>
            <Paper withBorder className='rounded-xl p-6'>
                <Stack className='gap-8'>
                    <Stack className='gap-4'>
                        <Skeleton className='h-[30px] w-20' />
                        <Skeleton className='h-[46px]' />
                    </Stack>
                    <Stack className='gap-4'>
                        <Skeleton className='h-[30px] w-36' />
                        <Stack className='gap-2.5'>
                            {Array.from({ length: specificationCount }, (_, index) => (
                                <Skeleton key={index} className='h-5 w-96 max-w-full' />
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>
        </>
    );
}
