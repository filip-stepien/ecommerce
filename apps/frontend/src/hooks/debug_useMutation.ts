import { useState } from 'react';

export type UseDebugMutationResult<TInput> = {
    mutate: (input: TInput) => Promise<void>;
    isPending: boolean;
};

export function debug_useMutation<TInput>(delayMs = 500): UseDebugMutationResult<TInput> {
    const [isPending, setIsPending] = useState(false);

    async function mutate(_input: TInput) {
        setIsPending(true);
        await new Promise(resolve => window.setTimeout(resolve, delayMs));
        setIsPending(false);
    }

    return { mutate, isPending };
}
