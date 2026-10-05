const priceFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

export function formatPrice(price: number): string {
    return priceFormat.format(price);
}
