import { Carousel } from '@mantine/carousel';
import { Stack, Text, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { QueryResult } from '@/components/QueryResult';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductCardSkeleton } from '@/features/products/components/ProductCardSkeleton';
import { useRecommendedProducts } from '@/features/products/hooks/useRecommendedProducts';

const skeletonCount = 4;

function CardCarousel({ children }: PropsWithChildren) {
    return (
        <Carousel
            slideSize={{ base: '100%', sm: '50%', lg: '25%' }}
            slideGap={20}
            emblaOptions={{ align: 'start', slidesToScroll: 'auto' }}
            classNames={{
                controls: 'hidden -inset-x-11 px-0 md:flex',
                control: 'data-inactive:invisible'
            }}
        >
            {children}
        </Carousel>
    );
}

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
                loader={
                    <CardCarousel>
                        {Array.from({ length: skeletonCount }, (_, index) => (
                            <Carousel.Slide key={index}>
                                <ProductCardSkeleton />
                            </Carousel.Slide>
                        ))}
                    </CardCarousel>
                }
            >
                {products => (
                    <CardCarousel>
                        {products.map(product => (
                            <Carousel.Slide key={product.id}>
                                <ProductCard product={product} />
                            </Carousel.Slide>
                        ))}
                    </CardCarousel>
                )}
            </QueryResult>
        </Stack>
    );
}
