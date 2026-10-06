const priceFormat = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    useGrouping: 'always'
});

export function formatPrice(price: number): string {
    return priceFormat.format(price);
}

export function formatCardNumber(value: string): string {
    return value
        .replace(/\D/g, '')
        .slice(0, 19)
        .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatCardExpiry(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4);

    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function formatCardCvc(value: string): string {
    return value.replace(/\D/g, '').slice(0, 4);
}

export function toNumber(value: number | string): number | null {
    return typeof value === 'number' ? value : null;
}
