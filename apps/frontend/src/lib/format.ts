const priceFormat = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    useGrouping: 'always'
});

const pluralRules = new Intl.PluralRules('pl-PL');

const productForms: Partial<Record<Intl.LDMLPluralRule, string>> = {
    one: 'produkt',
    few: 'produkty',
    many: 'produktów'
};

export function formatPrice(price: number): string {
    return priceFormat.format(price);
}

export function formatProductCount(count: number): string {
    return `${count} ${productForms[pluralRules.select(count)] ?? 'produktu'}`;
}

export function toNumber(value: number | string): number | null {
    return typeof value === 'number' ? value : null;
}
