import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { Link } from 'react-router';

export type BreadcrumbItem = {
    label: string;
    to?: string;
};

type PageBreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
    return (
        <Breadcrumbs
            separatorMargin={4}
            classNames={{
                root: 'flex-wrap text-xs leading-normal text-dimmed',
                separator: 'text-dimmed'
            }}
        >
            {items.map(item =>
                item.to ? (
                    <Anchor
                        key={item.label}
                        component={Link}
                        to={item.to}
                        className='text-xs text-dimmed'
                    >
                        {item.label}
                    </Anchor>
                ) : (
                    <Text key={item.label} className='text-xs leading-normal text-dimmed'>
                        {item.label}
                    </Text>
                )
            )}
        </Breadcrumbs>
    );
}
