import { ProductCarousel } from '@/features/products/components/ProductCarousel';
import { useRelatedProducts } from '@/features/products/hooks/useRelatedProducts';

type RelatedProductsCarouselProps = {
    productId: string | number;
};

export function RelatedProductsCarousel({ productId }: RelatedProductsCarouselProps) {
    const { products, isLoading, error } = useRelatedProducts(productId);

    return (
        <ProductCarousel
            title='Powiązane produkty'
            subtitle='Te produkty też mogą Cię zainteresować.'
            products={products}
            isLoading={isLoading}
            error={error}
            errorText='Nie udało się pobrać produktów z tej kategorii'
        />
    );
}
