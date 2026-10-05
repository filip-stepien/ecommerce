import { useGetProducts } from '@/api/generated/products/products';
import { QueryResult } from '@/components/QueryResult';

const priceFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

export function ProductsPage() {
    const { data: products, isPending, error } = useGetProducts();

    return (
        <section>
            <h2>Produkty</h2>
            <QueryResult
                data={products}
                isLoading={isPending}
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
