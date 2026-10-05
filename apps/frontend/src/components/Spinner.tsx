import { Center, Loader } from '@mantine/core';

export function Spinner() {
    return (
        <Center role='status' aria-label='Ładowanie' className='py-16'>
            <Loader />
        </Center>
    );
}
