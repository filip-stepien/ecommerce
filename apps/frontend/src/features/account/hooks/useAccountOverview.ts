import type { RequestError } from '@/api/error';
import { debug_useQuery } from '@/hooks/debug_useQuery';

export type OrderStatus = 'inTransit' | 'delivered';

export type Order = {
    number: string;
    date: string;
    firstItemName: string;
    otherItemCount: number;
    status: OrderStatus;
    total: number;
};

export type PersonalOffer = {
    id: string;
    title: string;
    description: string[];
    actionLabel: string;
};

export type Address = {
    recipient: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    lastUsedOrderNumber: string | null;
};

export type AccountOverview = {
    favoriteCount: number;
    orders: Order[];
    offers: PersonalOffer[];
    defaultAddress: Address;
};

export type UseAccountOverviewResult = {
    overview: AccountOverview | null;
    isLoading: boolean;
    error: RequestError | null;
};

function debug_useStaticAccountOverview(): UseAccountOverviewResult {
    const { data, isLoading } = debug_useQuery<AccountOverview>({
        favoriteCount: 3,
        orders: [
            {
                number: 'VLT-2026-1048',
                date: '2026-10-03',
                firstItemName: 'Sony WH-1000XM5',
                otherItemCount: 3,
                status: 'inTransit',
                total: 1960.99
            },
            {
                number: 'VLT-2026-0921',
                date: '2026-09-12',
                firstItemName: 'Apple MacBook Air 13″ M3',
                otherItemCount: 0,
                status: 'delivered',
                total: 5299
            }
        ],
        offers: [
            {
                id: 'volt100',
                title: '100 zł na kolejne zakupy',
                description: [
                    'Za zakup MacBooka Air 12.09.2026.',
                    'Kod VOLT100 · zamówienia od 1 500 zł.',
                    'Ważny do 31.10.2026.'
                ],
                actionLabel: 'Zobacz polecane akcesoria'
            },
            {
                id: 'headphones',
                title: 'Dźwięk w Twoim stylu',
                description: [
                    'Ostatnio oglądasz słuchawki z ANC.',
                    'Porównaj Sony, Bose i JBL — znajdź',
                    'model idealny do pracy i podróży.'
                ],
                actionLabel: 'Odkryj słuchawki'
            }
        ],
        defaultAddress: {
            recipient: 'Anna Kowalska',
            street: 'ul. Długa 12/8',
            postalCode: '00-238',
            city: 'Warszawa',
            country: 'Polska',
            lastUsedOrderNumber: 'VLT-2026-1048'
        }
    });

    return {
        overview: data ?? null,
        isLoading,
        error: null
    };
}

export { debug_useStaticAccountOverview as useAccountOverview };
