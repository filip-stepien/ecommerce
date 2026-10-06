import { Button, Divider, Paper, Stack, Text, Title } from '@mantine/core';
import type { DeliveryMethod } from '@/features/checkout/hooks/useCheckoutOptions';
import { formatPrice } from '@/lib/format';

type OrderSummaryProps = {
    itemCount: number;
    productsTotal: number;
    deliveryMethod: DeliveryMethod | undefined;
    vatRate: number;
    isSubmitting: boolean;
};

export function OrderSummary({
    itemCount,
    productsTotal,
    deliveryMethod,
    vatRate,
    isSubmitting
}: OrderSummaryProps) {
    const total = productsTotal + (deliveryMethod?.price ?? 0);
    const vat = (total * vatRate) / (1 + vatRate);

    return (
        <Paper withBorder shadow='xs' className='rounded-lg p-6'>
            <Stack className='gap-4'>
                <Title order={2} className='text-lg font-semibold'>
                    Podsumowanie
                </Title>
                <Stack className='gap-0'>
                    <Text className='text-sm leading-loose text-dimmed'>
                        Produkty ({itemCount} szt.)
                    </Text>
                    <Text className='text-sm leading-loose font-semibold'>
                        {formatPrice(productsTotal)}
                    </Text>
                    {deliveryMethod && (
                        <>
                            <Text className='text-sm leading-loose text-dimmed'>
                                Dostawa - {deliveryMethod.name}
                            </Text>
                            <Text className='text-sm leading-loose font-semibold'>
                                {formatPrice(deliveryMethod.price)}
                            </Text>
                        </>
                    )}
                    <Divider className='my-4' />
                    <Text className='mb-1.5 text-sm'>Łącznie</Text>
                    <Text className='text-3xl leading-tight font-bold'>{formatPrice(total)}</Text>
                    <Text className='mt-1.5 text-xs leading-normal text-dimmed'>
                        W tym VAT: {formatPrice(vat)}
                    </Text>
                </Stack>
                <Button type='submit' size='md' className='w-fit' loading={isSubmitting}>
                    Zamawiam i płacę
                </Button>
            </Stack>
        </Paper>
    );
}
