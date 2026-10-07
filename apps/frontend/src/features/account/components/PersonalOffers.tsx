import { Button, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import type { PersonalOffer } from '@/features/account/hooks/useAccountOverview';
import { appRoutes } from '@/lib/routes';

type PersonalOffersProps = {
    offers: PersonalOffer[];
};

export function PersonalOffers({ offers }: PersonalOffersProps) {
    return (
        <Stack id='offers' className='gap-3.5'>
            <Title order={2} className='text-[22px] leading-normal font-semibold'>
                Oferty dla Ciebie
            </Title>
            <SimpleGrid className='grid-cols-1 gap-5 sm:grid-cols-2'>
                {offers.map(offer => (
                    <Paper key={offer.id} withBorder shadow='xs' className='rounded-lg p-[23px]'>
                        <Stack className='h-full items-start gap-[17px]'>
                            <Text className='text-lg leading-[1.55] font-semibold'>
                                {offer.title}
                            </Text>
                            <Text className='text-[13px] leading-[1.7] text-dimmed'>
                                {offer.description.map(line => (
                                    <span key={line} className='block'>
                                        {line}
                                    </span>
                                ))}
                            </Text>
                            <Button component={Link} to={appRoutes.home} size='md'>
                                {offer.actionLabel}
                            </Button>
                        </Stack>
                    </Paper>
                ))}
            </SimpleGrid>
        </Stack>
    );
}
