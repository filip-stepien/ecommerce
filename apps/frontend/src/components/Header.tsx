import { Box, Container, Group, Text } from '@mantine/core';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { CategoryNav } from '@/components/CategoryNav';
import { AccountMenu } from '@/features/auth/components/AccountMenu';
import { AppRoutes } from '@/lib/routes';

export function Header() {
    return (
        <Box component='header' className='bg-body'>
            <Container>
                <Group className='h-22 justify-between'>
                    <Text
                        component={Link}
                        to={AppRoutes.home}
                        className='text-[32px] leading-none font-bold'
                    >
                        E-sklep
                    </Text>
                    <Group className='gap-6'>
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
