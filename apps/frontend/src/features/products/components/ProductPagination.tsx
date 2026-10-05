import { Group, Pagination, Select, Text } from '@mantine/core';
import { catalogPageSizeOptions } from '@/features/products/hooks/useProductCatalog';

type ProductPaginationProps = {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    disabled?: boolean;
};

export function ProductPagination({
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    disabled
}: ProductPaginationProps) {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    return (
        <Group className='justify-between'>
            <Group className='gap-3'>
                <Text className='text-sm text-dimmed'>Na stronę:</Text>
                <Select
                    aria-label='Liczba produktów na stronę'
                    className='w-20'
                    data={catalogPageSizeOptions.map(String)}
                    value={String(pageSize)}
                    onChange={value => value && onPageSizeChange(Number(value))}
                    allowDeselect={false}
                    disabled={disabled}
                />
            </Group>
            <Pagination
                size='sm'
                total={pageCount}
                value={page}
                onChange={onPageChange}
                withControls={false}
                disabled={disabled}
            />
        </Group>
    );
}
