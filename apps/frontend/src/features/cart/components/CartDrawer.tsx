import { Button, Drawer, Group, Stack, Text } from '@mantine/core';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { CartDrawerItem } from '@/features/cart/components/CartDrawerItem';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/lib/format';
import { appRoutes } from '@/lib/routes';

export function CartDrawer() {
    const { items, isOpen, close } = useCart();

    return (
        <Drawer
            opened={isOpen}
            onClose={close}
            position='right'
            title='Koszyk'
            classNames={{
                content: 'flex flex-col',
                header: 'p-6',
                title: 'text-lg font-semibold',
                body: 'flex min-h-0 flex-1 flex-col p-0'
            }}
        >
            {items.length === 0 ? <CartDrawerEmpty /> : <CartDrawerContent />}
        </Drawer>
    );
}

function CartDrawerContent() {
    const { items, total, close } = useCart();

    return (
        <>
            <Stack className='min-h-0 flex-1 gap-5 overflow-y-auto px-6 pt-1 pb-6'>
                {items.map(item => (
                    <CartDrawerItem key={item.id} item={item} />
                ))}
            </Stack>
            <Stack className='gap-4 border-t border-default-border p-6'>
                <Group className='justify-between'>
                    <Text className='text-sm'>Łącznie z VAT</Text>
                    <Text className='text-[22px] leading-tight font-bold'>
                        {formatPrice(total)}
                    </Text>
                </Group>
                <Button component={Link} to={appRoutes.checkout} size='md' onClick={close}>
                    Przejdź do podsumowania
                </Button>
            </Stack>
        </>
    );
}

function CartDrawerEmpty() {
    return (
        <Stack className='flex-1 items-center justify-center gap-1 px-6 pb-16 text-center'>
            <ShoppingBag size={96} strokeWidth={1} className='mb-3 text-dimmed opacity-40' />
            <Text className='text-lg font-semibold text-dimmed'>Twój koszyk jest pusty</Text>
            <Text className='text-sm text-dimmed'>Dodane produkty pojawią się w tym miejscu.</Text>
        </Stack>
    );
}
