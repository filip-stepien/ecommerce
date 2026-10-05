import { Box, Container, Group, Text } from '@mantine/core';
import { Link } from 'react-router';
import { useProductCategories } from '@/features/products/hooks/useProductCategories';
import { appRoutes } from '@/lib/routes';

export function CategoryNav() {
    const { categories } = useProductCategories();

    return (
        <Box className='border-y border-default-border'>
            <Container>
                <Group component='nav' className='h-11.5 flex-nowrap gap-8.5'>
                    <Text component={Link} to={appRoutes.home} className='text-sm font-semibold'>
                        Wszystkie produkty
                    </Text>
                    {[...categories, 'Nowości'].map(category => (
                        <Text key={category} className='text-sm font-semibold'>
                            {category}
                        </Text>
                    ))}
                    <Text className='text-sm font-semibold text-anchor'>Oferty dla Ciebie</Text>
                </Group>
            </Container>
        </Box>
    );
}
