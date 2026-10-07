import {
    Button,
    Center,
    Image,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
    UnstyledButton
} from '@mantine/core';
import { Package } from 'lucide-react';
import { Link, generatePath } from 'react-router';
import type { Product } from '@/api/generated/model';
import { QueryResult } from '@/components/QueryResult';
import { useCart } from '@/features/cart/hooks/useCart';
import { useRecommendedProducts } from '@/features/products/hooks/useRecommendedProducts';
import { formatPrice } from '@/lib/format';
import { appRoutes } from '@/lib/routes';

const recommendationCount = 3;

function RecommendedProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();
    const image = product.imageUrl ?? null;

    return (
        <Paper withBorder shadow='xs' className='h-104 rounded-lg p-[23px]'>
            <Stack className='h-full gap-[17px]'>
                <UnstyledButton
                    component={Link}
                    to={generatePath(appRoutes.product, { id: String(product.id) })}
                    className='flex min-h-0 flex-1 flex-col gap-[17px]'
                >
                    {image ? (
                        <Image
                            src={image}
                            alt={product.name}
                            className='min-h-0 flex-1 rounded-[5px] object-cover'
                        />
                    ) : (
                        <Center className='min-h-0 flex-1 rounded-[5px] bg-placeholder'>
                            <Package size={48} strokeWidth={1.25} className='text-dimmed' />
                        </Center>
                    )}
                    <Text className='text-lg leading-[1.55] font-semibold'>{product.name}</Text>
                </UnstyledButton>
                <Stack className='gap-0'>
                    <Text className='text-xs leading-[1.6] text-(--mantine-color-blue-8)'>
                        Dopasowane do Twoich zakupów
                    </Text>
                    <Text className='text-[22px] leading-[1.6] font-bold'>
                        {formatPrice(product.price)}
                    </Text>
                </Stack>
                <Button
                    size='md'
                    className='self-start'
                    onClick={() =>
                        addItem(
                            { id: product.id, name: product.name, price: product.price },
                            { image }
                        )
                    }
                >
                    Dodaj do koszyka
                </Button>
            </Stack>
        </Paper>
    );
}

export function AccountRecommendations() {
    const { products, isLoading, error } = useRecommendedProducts(recommendationCount);

    return (
        <Stack className='gap-4'>
            <Title order={2} className='text-[22px] leading-normal font-semibold'>
                Na podstawie Twoich zakupów i oglądanych produktów
            </Title>
            <QueryResult
                data={products}
                isLoading={isLoading}
                error={error}
                errorText='Nie udało się pobrać polecanych produktów'
            >
                {products => (
                    <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-3'>
                        {products.map(product => (
                            <RecommendedProductCard key={product.id} product={product} />
                        ))}
                    </SimpleGrid>
                )}
            </QueryResult>
        </Stack>
    );
}
