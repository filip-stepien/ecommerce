import { Group, TextInput } from '@mantine/core';
import { Search } from 'lucide-react';

type ProductSearchProps = {
    value: string;
    onChange: (value: string) => void;
};

export function ProductSearch({ value, onChange }: ProductSearchProps) {
    return (
        <Group className='w-162.5 gap-3' wrap='nowrap'>
            <TextInput
                className='flex-1'
                aria-label='Szukaj produktów'
                placeholder='Szukaj produktów, marek i kategorii…'
                value={value}
                onChange={event => onChange(event.currentTarget.value)}
            />
            <Search size={20} className='shrink-0 text-icon' aria-hidden />
        </Group>
    );
}
