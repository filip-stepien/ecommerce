import { useEffect, useRef, useState } from 'react';
import { fetchAssistantReply } from '@/features/chat/lib/assistantStream';
import {
    applyReplyEvent,
    type ChatMessage,
    createPendingReply,
    createUserMessage,
    messageMaxLength,
    toChatRequest
} from '@/features/chat/lib/conversation';

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const activeReply = useRef<AbortController | null>(null);
    const replying = messages.some(message => message.status === 'streaming');

    useEffect(() => () => activeReply.current?.abort(), []);

    function updateMessage(id: string, update: (message: ChatMessage) => ChatMessage) {
        setMessages(current =>
            current.map(message => (message.id === id ? update(message) : message))
        );
    }

    async function sendMessage(value: string) {
        const content = value.trim();
        if (!content || content.length > messageMaxLength || replying) return;

        const question = createUserMessage(content);
        const reply = createPendingReply();
        const request = toChatRequest([...messages, question]);
        const controller = new AbortController();

        activeReply.current = controller;
        setMessages(current => [...current, question, reply]);

        try {
            await fetchAssistantReply(
                request,
                event => updateMessage(reply.id, message => applyReplyEvent(message, event)),
                controller.signal
            );
        } catch {
            const status = controller.signal.aborted ? 'complete' : 'failed';
            updateMessage(reply.id, message =>
                message.status === 'streaming' ? { ...message, status } : message
            );
        } finally {
            activeReply.current = null;
        }
    }

    function stopReply() {
        activeReply.current?.abort();
    }

    return { messages, replying, sendMessage, stopReply };
}
