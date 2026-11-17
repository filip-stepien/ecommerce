import type { PropsWithChildren } from 'react';
import { Flex, Stack, Text, Title } from '@mantine/core';
import { type BreadcrumbItem, PageBreadcrumbs } from '@/components/PageBreadcrumbs';
import { AccountNavigation } from '@/features/account/components/AccountNavigation';
import type { User } from '@/features/auth/hooks/useCurrentUser';

type AccountLayoutProps = PropsWithChildren<{
    user: User;
    breadcrumbs: BreadcrumbItem[];
    title: string;
    description: string;
}>;

export function AccountLayout({
    user,
    breadcrumbs,
    title,
    description,
    children
}: AccountLayoutProps) {
    return (
        <Stack className='gap-7'>
            <Stack className='gap-2'>
                <PageBreadcrumbs items={breadcrumbs} />
                <Title order={1} className='text-[32px]'>
                    {title}
                </Title>
                <Text className='text-sm text-dimmed'>{description}</Text>
            </Stack>
            <Flex className='flex-col items-start gap-7 md:flex-row'>
                <AccountNavigation user={user} />
                <Stack className='w-full min-w-0 flex-1 gap-6 md:w-auto'>{children}</Stack>
            </Flex>
        </Stack>
    );
}
