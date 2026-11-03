import { useEffect, useRef } from 'react';
import { Button, Paper, ScrollArea, Stack, Text, ThemeIcon } from '@mantine/core';
import { Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/features/chat/hooks/useChat';

const suggestions = ['Słuchawki do 300 zł', 'Pomóż dobrać laptop', 'Zestaw do pracy z domu'];

type ChatConversationProps = {
    messages: ChatMessage[];
    onSend: (value: string) => void;
};

export function ChatConversation({ messages, onSend }: ChatConversationProps) {
    const viewport = useRef<HTMLDivElement>(null);

    useEffect(() => {
        viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
    }, [messages.length]);

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
                >
                    {messages.map(message => (
                        <Paper
                            key={message.id}
                            p='sm'
                            radius='lg'
                            className={`max-w-[90%] ${message.role === 'user' ? 'self-end bg-(--mantine-color-blue-8) text-white' : 'self-start bg-(--mantine-color-gray-1) dark:bg-(--mantine-color-dark-6)'}`}
                        >
                            <Text size='xs' fw={600} mb={4}>
                                {message.role === 'user' ? 'Ty' : 'Asystent volt'}
                            </Text>
                            <Text size='sm' className='whitespace-pre-wrap wrap-anywhere'>
                                {message.content}
                            </Text>
                        </Paper>
                    ))}
                </Stack>
            </Stack>
        </ScrollArea>
    );
}
