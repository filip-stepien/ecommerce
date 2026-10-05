import { TextInput } from '@mantine/core';
import { Search } from 'lucide-react';

type ProductSearchProps = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export function ProductSearch({ value, onChange, disabled }: ProductSearchProps) {
    return (
        <TextInput
            aria-label='Szukaj produktów'
            placeholder='Szukaj produktów…'
            rightSection={<Search size={18} />}
            rightSectionPointerEvents='none'
            value={value}
            disabled={disabled}
            onChange={event => onChange(event.currentTarget.value)}
        />
    );
}
