import { Flex, Stack } from '@mantine/core';
import { useParams } from 'react-router';
import { BackButton } from '@/components/BackButton';
import { QueryResult } from '@/components/QueryResult';
import { ProductDescription } from '@/features/products/components/ProductDescription';
import { ProductDetailsSkeleton } from '@/features/products/components/ProductDetailsSkeleton';
import { ProductGallery } from '@/features/products/components/ProductGallery';
import { ProductPurchaseInfo } from '@/features/products/components/ProductPurchaseInfo';
import { RelatedProductsCarousel } from '@/features/products/components/RelatedProductsCarousel';
import { useProductDetails } from '@/features/products/hooks/useProductDetails';
import { appRoutes } from '@/lib/routes';

export function ProductDetailsPage() {
    const { id = '' } = useParams();
    const { product, isLoading, error } = useProductDetails(id);

    return (
        <Stack className='gap-7'>
            <BackButton to={appRoutes.home}>Wróć do produktów</BackButton>
            <QueryResult
                data={product}
                isLoading={isLoading}
                error={error}
                errorText='Nie udało się pobrać produktu'
                loader={<ProductDetailsSkeleton />}
            >
                {product => (
                    <>
                        <Flex className='flex-col gap-13 lg:flex-row'>
                            <ProductGallery product={product} />
                            <ProductPurchaseInfo product={product} />
                        </Flex>
                        <ProductDescription product={product} />
                    </>
                )}
            </QueryResult>
            <RelatedProductsCarousel productId={id} />
        </Stack>
    );
}
