import { Box, Container, Text } from '@mantine/core';

export function Footer() {
    return (
        <Box component='footer' className='border-t border-default-border bg-body py-7'>
            <Container>
                <Text className='text-center text-xs text-dimmed'>
                    © 2026 Filip Stępień, Rafał Grot, Bartłomiej Karkoszka
                </Text>
            </Container>
        </Box>
    );
}
