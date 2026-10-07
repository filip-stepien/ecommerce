import { Anchor, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import { AccountCard } from '@/features/account/components/AccountCard';
import type { Address } from '@/features/account/hooks/useAccountOverview';
import type { User } from '@/features/auth/hooks/useCurrentUser';

type SavedCustomerInfoProps = {
    user: User;
    address: Address;
};

type InfoCardProps = PropsWithChildren<{
    id: string;
    title: string;
    lines: string[];
}>;

function InfoCard({ id, title, lines, children }: InfoCardProps) {
    return (
        <AccountCard id={id}>
            <Stack className='items-start gap-3'>
                <Group className='w-full items-start justify-between'>
                    <Title order={3} className='text-lg leading-normal font-semibold'>
                        {title}
                    </Title>
                    <Anchor component='button' type='button' className='text-[13px]'>
                        Edytuj
                    </Anchor>
                </Group>
                <Text className='text-sm leading-normal'>
                    {lines.map(line => (
                        <span key={line} className='block'>
                            {line}
                        </span>
                    ))}
                </Text>
                {children}
            </Stack>
        </AccountCard>
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
                title='Domyślny adres'
                lines={[
                    address.recipient,
                    address.street,
                    `${address.postalCode} ${address.city}, ${address.country}`
                ]}
            >
                {address.lastUsedOrderNumber && (
                    <Text className='text-xs leading-normal text-dimmed'>
                        Wykorzystany w zamówieniu #{address.lastUsedOrderNumber}
                    </Text>
                )}
            </InfoCard>
        </SimpleGrid>
    );
}
