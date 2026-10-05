const priceFormat = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    useGrouping: 'always'
});

export function formatPrice(price: number): string {
    return priceFormat.format(price);
}

export function toNumber(value: number | string): number | null {
    return typeof value === 'number' ? value : null;
}
