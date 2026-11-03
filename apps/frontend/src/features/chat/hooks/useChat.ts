import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

export type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export const messageMaxLength = 1000;

export function useChat() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    function sendMessage(value: string) {
        const content = value.trim();
        if (!content || content.length > messageMaxLength) return;

        setMessages(current => [
            ...current,
            { id: crypto.randomUUID(), role: 'user', content },
            {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: 'Asystent jest chwilowo niedostępny. Spróbuj ponownie później.'
            }
        ]);
        setDraft('');
    }

    return { opened, toggle, close, draft, setDraft, messages, sendMessage };
}
