import { Carousel } from '@mantine/carousel';
import { Stack, Text, Title } from '@mantine/core';
import { QueryResult } from '@/components/QueryResult';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useRecommendedProducts } from '@/features/products/hooks/useRecommendedProducts';

export function RecommendedProductsCarousel() {
    const { products, isLoading, error } = useRecommendedProducts();

    return (
        <Stack className='gap-5'>
            <Stack className='gap-1'>
                <Title order={2} className='text-2xl'>
                    Proponowane dla Ciebie
                </Title>
                <Text className='text-sm text-dimmed'>Produkty, które mogą Cię zainteresować.</Text>
            </Stack>
            <QueryResult
                data={products}
                isLoading={isLoading}
                error={error}
                errorText='Nie udało się pobrać proponowanych produktów'
            >
                {products => (
                    <Carousel
                        slideSize={{ base: '100%', sm: '50%', lg: '25%' }}
                        slideGap={20}
                        emblaOptions={{ align: 'start', slidesToScroll: 'auto' }}
                        classNames={{
                            controls: 'hidden -inset-x-11 px-0 md:flex',
                            control: 'data-inactive:invisible'
                        }}
                    >
                        {products.map(product => (
                            <Carousel.Slide key={product.id}>
                                <ProductCard product={product} />
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                )}
            </QueryResult>
        </Stack>
    );
}
