import { useMatches } from '@mantine/core';

export function useIsMobile(): boolean {
    return useMatches({ base: true, sm: false });
}
