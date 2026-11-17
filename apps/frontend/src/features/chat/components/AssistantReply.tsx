import { Loader, Paper, Stack, Text } from '@mantine/core';
import { ChatProductCard } from '@/features/chat/components/ChatProductCard';
import type { ChatMessage } from '@/features/chat/lib/conversation';

const replyFailedMessage = 'Asystent jest chwilowo niedostępny. Spróbuj ponownie za chwilę.';

type AssistantReplyProps = {
    reply: ChatMessage;
};

export function AssistantReply({ reply }: AssistantReplyProps) {
    const waitingForText = reply.status === 'streaming' && !reply.content;

    return (
        <Stack className='w-full gap-2 self-start'>
            {(reply.content || waitingForText) && (
                <Paper className='max-w-[90%] self-start rounded-lg bg-(--mantine-color-gray-1) p-3 dark:bg-(--mantine-color-dark-6)'>
                    <Text className='mb-1 text-xs font-semibold'>Asystent volt</Text>
                    {waitingForText ? (
                        <Loader type='dots' size='sm' aria-label='Asystent pisze odpowiedź' />
                    ) : (
                        <Text className='text-sm whitespace-pre-wrap wrap-anywhere'>
                            {reply.content}
                        </Text>
                    )}
                </Paper>
            )}
            {reply.products.length > 0 && (
                <Stack className='gap-2' aria-label='Proponowane produkty'>
                    {reply.products.map(product => (
                        <ChatProductCard key={product.id} product={product} />
                    ))}
                </Stack>
            )}
            {reply.status === 'failed' && (
                <Text role='alert' className='text-sm text-(--mantine-color-error)'>
                    {replyFailedMessage}
                </Text>
            )}
        </Stack>
    );
}
