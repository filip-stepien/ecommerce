import { Text } from '@mantine/core';
import type { PropsWithChildren } from 'react';

type StatusBadgeProps = PropsWithChildren<{
    tone: 'info' | 'success';
}>;

const toneClassNames = {
    info: 'bg-(--mantine-color-blue-0) text-(--mantine-color-blue-8)',
    success: 'bg-[#ebf7f0] text-[#237b57]'
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
    return (
        <Text
            component='span'
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs leading-normal font-semibold whitespace-nowrap ${toneClassNames[tone]}`}
        >
            {children}
        </Text>
    );
}
