export const appRoutes = {
    home: '/',
    account: '/account',
    orders: '/account/orders',
    order: '/account/orders/:number',
    product: '/products/:id',
    checkout: '/checkout'
} as const;

export const orderPath = (number: string) => `${appRoutes.orders}/${encodeURIComponent(number)}`;
