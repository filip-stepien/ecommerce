import { TextInput } from '@mantine/core';
import { Search } from 'lucide-react';

type ProductSearchProps = {
    value: string;
    onChange: (value: string) => void;
};

export function ProductSearch({ value, onChange }: ProductSearchProps) {
    return (
        <TextInput
            placeholder='Szukaj produktów…'
            rightSection={<Search size={18} />}
            rightSectionPointerEvents='none'
            value={value}
            onChange={event => onChange(event.currentTarget.value)}
        />
    );
}
