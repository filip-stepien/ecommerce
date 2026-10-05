import { QueryResult } from '@/components/QueryResult';
import { useProducts } from '@/features/products/hooks/useProducts';
import { formatPrice } from '@/lib/format';

export function ProductsPage() {
    const { products, isLoading, error } = useProducts();

    return (
        <section>
            <h2>Produkty</h2>
            <QueryResult
                data={products}
                isLoading={isLoading}
                error={error}
                loadingText='Ładowanie produktów…'
                errorText='Nie udało się pobrać produktów'
            >
                {products => (
                    <ul className='products'>
                        {products.map(product => (
                            <li key={product.id}>
                                <span>{product.name}</span>
                                <span>{formatPrice(product.price)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </QueryResult>
        </section>
    );
}
