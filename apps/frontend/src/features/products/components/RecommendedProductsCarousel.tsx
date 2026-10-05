import { ProductCarousel } from '@/features/products/components/ProductCarousel';
import { useRecommendedProducts } from '@/features/products/hooks/useRecommendedProducts';

export function RecommendedProductsCarousel() {
    const { products, isLoading, error } = useRecommendedProducts();

    return (
        <ProductCarousel
            title='Proponowane dla Ciebie'
            subtitle='Produkty, które mogą Cię zainteresować.'
            products={products}
            isLoading={isLoading}
            error={error}
            errorText='Nie udało się pobrać proponowanych produktów'
        />
    );
}
