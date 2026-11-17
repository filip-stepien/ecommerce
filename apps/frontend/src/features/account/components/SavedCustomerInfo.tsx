import { SimpleGrid, Stack, Text, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { SectionCard } from '@/components/SectionCard';
import type { Address } from '@/features/account/hooks/useAccountOverview';
import type { User } from '@/features/auth/hooks/useCurrentUser';

type SavedCustomerInfoProps = {
    user: User;
    address: Address | null;
};

type InfoCardProps = PropsWithChildren<{
    id: string;
    title: string;
    lines: string[];
}>;

function InfoCard({ id, title, lines, children }: InfoCardProps) {
    return (
        <SectionCard id={id}>
            <Stack className='items-start gap-3'>
                <Title order={3} className='text-lg leading-normal font-semibold'>
                    {title}
                </Title>
                <Text className='text-sm leading-normal'>
                    {lines.map(line => (
                        <span key={line} className='block'>
                            {line}
                        </span>
                    ))}
                </Text>
                {children}
            </Stack>
        </SectionCard>
    );
}

export function SavedCustomerInfo({ user, address }: SavedCustomerInfoProps) {
    return (
        <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-2'>
            <InfoCard
                id='personal-data'
                title='Dane osobowe'
                lines={[user.username, user.email ?? '—', `Role: ${user.roles.join(', ') || '—'}`]}
            />
            <InfoCard
                id='address'
                title='Ostatni adres dostawy'
                lines={[
                    ...(address
                        ? [
                              address.recipient,
                              address.street,
                              `${address.postalCode} ${address.city}, ${address.country}`
                          ]
                        : ['Brak adresu — pojawi się po złożeniu zamówienia.'])
                ]}
            >
                {address?.lastUsedOrderNumber && (
                    <Text className='text-xs leading-normal text-dimmed'>
                        Wykorzystany w zamówieniu #{address.lastUsedOrderNumber}
                    </Text>
                )}
            </InfoCard>
        </SimpleGrid>
    );
}
