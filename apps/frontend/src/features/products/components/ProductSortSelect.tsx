import { Group, Select, Text } from '@mantine/core';
import type { ProductSort } from '@/features/products/hooks/useProducts';

const sortOptions: { value: ProductSort; label: string }[] = [
    { value: 'default', label: 'Domyślnie' },
    { value: 'priceAsc', label: 'Cena: od najniższej' },
    { value: 'priceDesc', label: 'Cena: od najwyższej' },
    { value: 'nameAsc', label: 'Nazwa: A-Z' }
];

type ProductSortSelectProps = {
    value: ProductSort;
    onChange: (sort: ProductSort) => void;
};

export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
    return (
        <Group className='gap-3'>
            <Text className='text-sm text-dimmed'>Sortuj:</Text>
            <Select
                aria-label='Sortowanie'
                className='w-55'
                data={sortOptions}
                value={value}
                onChange={sort => sort && onChange(sort as ProductSort)}
                allowDeselect={false}
            />
        </Group>
    );
}
