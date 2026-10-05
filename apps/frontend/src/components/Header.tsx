import { ActionIcon, Anchor, Box, Container, Group, Text } from '@mantine/core';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { AccountMenu } from '@/features/auth/components/AccountMenu';
import { ProductSearch } from '@/features/products/components/ProductSearch';
import {
    getCatalogPath,
    useCatalogSearchParams
} from '@/features/products/hooks/useCatalogSearchParams';
import { useProductCategories } from '@/features/products/hooks/useProductCategories';
import { appRoutes } from '@/lib/routes';

function Brand() {
    return (
        <Text
            component={Link}
            to={appRoutes.home}
            className='shrink-0 text-[32px] leading-none font-bold'
        >
            E-sklep
        </Text>
    );
}

function CatalogSearch() {
    const { search, setCatalogSearchParams } = useCatalogSearchParams();

    return <ProductSearch value={search} onChange={search => setCatalogSearchParams({ search })} />;
}

type CategoryLinkProps = {
    label: string;
    to: string;
    active?: boolean;
    highlighted?: boolean;
};

function CategoryLink({ label, to, active = false, highlighted = false }: CategoryLinkProps) {
    return (
        <Anchor
            component={Link}
            to={to}
            underline='hover'
            c={active || highlighted ? 'blue.8' : 'bright'}
            aria-current={active ? 'page' : undefined}
            className='text-sm font-semibold'
        >
            {label}
        </Anchor>
    );
}

function CategoryNav() {
    const { categories } = useProductCategories();
    const { category: activeCategory, isCatalog } = useCatalogSearchParams();

    return (
        <Box component='nav' aria-label='Kategorie' className='border-t border-default-border'>
            <Container>
                <Group className='h-11.5 gap-8.5' wrap='nowrap'>
                    <CategoryLink
                        label='Wszystkie produkty'
                        to={getCatalogPath()}
                        active={isCatalog && activeCategory === null}
                    />
                    {categories.map(category => (
                        <CategoryLink
                            key={category}
                            label={category}
                            to={getCatalogPath({ category })}
                            active={activeCategory === category}
                        />
                    ))}
                    <CategoryLink label='Nowości' to={getCatalogPath()} />
                    <CategoryLink label='Oferty dla Ciebie' to={getCatalogPath()} highlighted />
                </Group>
            </Container>
        </Box>
    );
}

export function Header() {
    return (
        <Box component='header' className='border-b border-default-border bg-body'>
            <Container>
                <Group className='h-22 gap-10' wrap='nowrap'>
                    <Brand />
                    <CatalogSearch />
                    <Group className='shrink-0 gap-6' wrap='nowrap'>
                        <ActionIcon
                            variant='transparent'
                            size={20}
                            aria-label='Ulubione'
                            className='text-icon'
                        >
                            <Heart size={20} />
                        </ActionIcon>
                        <AccountMenu />
                        <Group className='gap-2'>
                            <ShoppingBag size={20} />
                            <Text className='text-sm font-semibold'>Koszyk</Text>
                        </Group>
                    </Group>
                </Group>
            </Container>
            <CategoryNav />
        </Box>
    );
}
