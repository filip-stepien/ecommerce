import { Carousel } from '@mantine/carousel';
import { Stack, Text, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import type { RequestError } from '@/api/error';
import type { Product } from '@/api/generated/model';
import { QueryResult } from '@/components/QueryResult';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductCardSkeleton } from '@/features/products/components/ProductCardSkeleton';

const skeletonCount = 4;

type ProductCarouselProps = {
    title: string;
    subtitle: string;
    products: Product[];
    isLoading: boolean;
    error: RequestError | null;
    errorText: string;
};

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

export function ProductCarousel({
    title,
    subtitle,
    products,
    isLoading,
    error,
    errorText
}: ProductCarouselProps) {
    return (
        <Stack className='gap-5'>
            <Stack className='gap-1'>
                <Title order={2} className='text-2xl'>
                    {title}
                </Title>
                <Text className='text-sm text-dimmed'>{subtitle}</Text>
            </Stack>
            <QueryResult
                data={products}
                isLoading={isLoading}
                error={error}
                errorText={errorText}
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
