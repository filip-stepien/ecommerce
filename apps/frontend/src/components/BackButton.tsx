import { Anchor } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router';

type BackButtonProps = PropsWithChildren<{
    to: string;
}>;

export function BackButton({ to, children }: BackButtonProps) {
    return (
        <Anchor
            component={Link}
            to={to}
            className='flex w-fit items-center gap-1.5 text-sm font-semibold'
        >
            <ArrowLeft size={16} />
            {children}
        </Anchor>
    );
}
