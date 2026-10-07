import { type RequestError, toRequestError } from '@/api/error';
import { useGetProduct } from '@/api/generated';
import type { Product, ProductDetails as ApiProductDetails } from '@/api/generated/model';
import { debug_useQuery } from '@/hooks/debug_useQuery';
import { env } from '@/lib/env';

export type ProductSpecification = {
    name: string;
    value: string;
};

export type ProductDetails = Product & {
    subtitle: string;
    description: string;
    images: string[];
    specifications: ProductSpecification[];
};

export type UseProductDetailsResult = {
    product: ProductDetails | null;
    isLoading: boolean;
    error: RequestError | null;
};

function toProductDetails(product: ApiProductDetails): ProductDetails {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        subtitle: product.subtitle ?? '',
        description: product.description ?? '',
        images: product.images,
        specifications: product.specifications
    };
}

function useApiProductDetails(id: string | number): UseProductDetailsResult {
    const { data, isLoading, error } = useGetProduct(Number(id), {
        query: { select: toProductDetails }
    });

    return {
        product: data ?? null,
        isLoading,
        error: toRequestError(error)
    };
}

function debug_useStaticProductDetails(id: string | number): UseProductDetailsResult {
    const { data, isLoading } = debug_useQuery<ProductDetails>({
        id: Number(id),
        name: 'Sony WH-1000XM5',
        price: 1299,
        subtitle: 'Bezprzewodowe słuchawki z redukcją hałasu',
        description:
            'Zaawansowana redukcja hałasu odcina codzienny zgiełk, a lekka konstrukcja zapewnia komfort przez cały dzień. Przełączaj się płynnie między laptopem a telefonem i ciesz się nawet 30 godzinami muzyki.',
        images: [
            'https://picsum.photos/seed/product-1/1200/800',
            'https://picsum.photos/seed/product-2/1200/800',
            'https://picsum.photos/seed/product-3/1200/800',
            'https://picsum.photos/seed/product-4/1200/800'
        ],
        specifications: [
            { name: 'Łączność', value: 'Bluetooth 5.2 · multipoint' },
            { name: 'Czas pracy', value: 'Do 30 h z ANC' },
            { name: 'Waga', value: '250 g' },
            { name: 'W zestawie', value: 'Etui, kabel USB-C, przewód audio' }
        ]
    });

    return {
        product: data ?? null,
        isLoading,
        error: null
    };
}

export const useProductDetails = env.isDebug ? debug_useStaticProductDetails : useApiProductDetails;
