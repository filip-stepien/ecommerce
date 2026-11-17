import { Center, Loader } from '@mantine/core';

export function Spinner() {
    return (
        <Center className='py-16'>
            <Loader />
        </Center>
    );
}
