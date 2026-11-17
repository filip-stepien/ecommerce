import { useEffect, useRef } from 'react';
import { Button, Paper, ScrollArea, Stack, Text, ThemeIcon } from '@mantine/core';
import { Sparkles } from 'lucide-react';
import { AssistantReply } from '@/features/chat/components/AssistantReply';
import type { ChatMessage } from '@/features/chat/lib/conversation';

const suggestions = ['Słuchawki do 300 zł', 'Pomóż dobrać laptop', 'Zestaw do pracy z domu'];

type ChatConversationProps = {
    messages: ChatMessage[];
    replying: boolean;
    onSend: (value: string) => void;
};

export function ChatConversation({ messages, replying, onSend }: ChatConversationProps) {
    const viewport = useRef<HTMLDivElement>(null);
    const lastMessage = messages.at(-1);

    useEffect(() => {
        viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
    }, [messages.length, lastMessage?.content.length, lastMessage?.products.length]);

    return (
        <ScrollArea className='min-h-0 flex-1' viewportRef={viewport} offsetScrollbars>
            <Stack gap='md' p='md'>
                <Stack gap='sm' align='flex-start' py='sm'>
                    <ThemeIcon size={44} radius='xl' variant='light'>
                        <Sparkles size={22} />
                    </ThemeIcon>
                    <Text fw={600} size='lg'>
                        Cześć! Czego szukasz?
                    </Text>
                    <Text size='sm' c='dimmed'>
                        Napisz, do czego potrzebujesz sprzętu i jaki masz budżet.
                    </Text>
                    {messages.length === 0 && (
                        <Stack gap={8} align='flex-start' mt={4}>
                            {suggestions.map(suggestion => (
                                <Button
                                    key={suggestion}
                                    variant='light'
                                    radius='xl'
                                    size='xs'
                                    onClick={() => onSend(suggestion)}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </Stack>
                    )}
                </Stack>
                <Stack
                    gap='sm'
                    role='log'
                    aria-label='Historia rozmowy'
                    aria-live='polite'
                    aria-relevant='additions'
                    aria-busy={replying}
                >
                    {messages.map(message =>
                        message.role === 'user' ? (
                            <Paper
                                key={message.id}
                                className='max-w-[90%] self-end rounded-lg bg-(--mantine-color-blue-8) p-3 text-white'
                            >
                                <Text className='mb-1 text-xs font-semibold'>Ty</Text>
                                <Text className='text-sm whitespace-pre-wrap wrap-anywhere'>
                                    {message.content}
                                </Text>
                            </Paper>
                        ) : (
                            <AssistantReply key={message.id} reply={message} />
                        )
                    )}
                </Stack>
            </Stack>
        </ScrollArea>
    );
}
