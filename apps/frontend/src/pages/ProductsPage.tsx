import { QueryResult } from '@/components/QueryResult';
import { useProducts } from '@/features/products/hooks/useProducts';

const priceFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

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
                                <span>{priceFormat.format(product.price)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </QueryResult>
        </section>
    );
}
