import { Text } from '@mantine/core';
import { formatProductCount } from '@/lib/format';

type ProductCountProps = {
    count: number;
};

export function ProductCount({ count }: ProductCountProps) {
    return <Text className='text-sm font-semibold'>{formatProductCount(count)}</Text>;
}
