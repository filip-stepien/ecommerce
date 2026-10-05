import {
    Anchor,
    Checkbox,
    Divider,
    Group,
    InputWrapper,
    NumberInput,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Text
} from '@mantine/core';
import { useProductCategories } from '@/features/products/hooks/useProductCategories';
import { useProductFilterOptions } from '@/features/products/hooks/useProductFilterOptions';
import type { ProductFilters } from '@/features/products/hooks/useProducts';
import { toNumber } from '@/lib/format';

type ProductFiltersProps = {
    values: ProductFilters;
    onChange: (patch: Partial<ProductFilters>) => void;
    onClear: () => void;
};

export function ProductFilters({ values, onChange, onClear }: ProductFiltersProps) {
    const { categories, isLoading: areCategoriesLoading } = useProductCategories();
    const { connectivityOptions, brands, isLoading: areOptionsLoading } = useProductFilterOptions();
    const isLoading = areCategoriesLoading || areOptionsLoading;

    return (
        <Paper withBorder className='w-full shrink-0 rounded-xl p-5 md:w-65'>
            <Stack className='gap-5'>
                <Group className='items-start justify-between'>
                    <Text className='text-lg font-semibold'>Filtry</Text>
                    <Anchor component='button' type='button' className='text-xs' onClick={onClear}>
                        Wyczyść
                    </Anchor>
                </Group>
                <Select
                    label='Kategoria'
                    placeholder='Wszystkie kategorie'
                    data={categories}
                    value={values.category}
                    onChange={category => onChange({ category })}
                    disabled={isLoading}
                    clearable
                />
                <Select
                    label='Łączność'
                    placeholder='Dowolna'
                    data={connectivityOptions}
                    value={values.connectivity}
                    onChange={connectivity => onChange({ connectivity })}
                    disabled={isLoading}
                    clearable
                />
                <Select
                    label='Producent'
                    placeholder='Wszystkie marki'
                    data={brands}
                    value={values.brand}
                    onChange={brand => onChange({ brand })}
                    disabled={isLoading}
                    clearable
                />
                <InputWrapper label='Cena (zł)'>
                    <SimpleGrid className='grid-cols-2 gap-2.5'>
                        <NumberInput
                            aria-label='Cena od'
                            placeholder='od'
                            min={0}
                            thousandSeparator=' '
                            hideControls
                            disabled={isLoading}
                            value={values.minPrice ?? ''}
                            onChange={value => onChange({ minPrice: toNumber(value) })}
                        />
                        <NumberInput
                            aria-label='Cena do'
                            placeholder='do'
                            min={0}
                            thousandSeparator=' '
                            hideControls
                            disabled={isLoading}
                            value={values.maxPrice ?? ''}
                            onChange={value => onChange({ maxPrice: toNumber(value) })}
                        />
                    </SimpleGrid>
                </InputWrapper>
                <Divider />
                <Text className='text-sm font-semibold'>Dostępność</Text>
                <Checkbox
                    label='Tylko dostępne'
                    disabled={isLoading}
                    checked={values.onlyAvailable}
                    onChange={event => onChange({ onlyAvailable: event.currentTarget.checked })}
                />
            </Stack>
        </Paper>
    );
}
