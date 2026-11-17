import type {
    AssistantStreamEvent,
    ChatMessage as ChatRequestMessage,
    ChatRequest,
    Product
} from '@/api/generated/model';
import {
    streamChatBodyMessagesItemContentMax,
    streamChatBodyMessagesItemProductIdsMax,
    streamChatBodyMessagesMax
} from '@/api/zod/assistant/assistant.zod';

export type ChatMessageStatus = 'streaming' | 'complete' | 'failed';

export type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    products: Product[];
    status: ChatMessageStatus;
};

export const messageMaxLength = 1000;

export function createUserMessage(content: string): ChatMessage {
    return { id: crypto.randomUUID(), role: 'user', content, products: [], status: 'complete' };
}

export function createPendingReply(): ChatMessage {
    return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        products: [],
        status: 'streaming'
    };
}

function toChatRequestMessage(message: ChatMessage): ChatRequestMessage {
    if (message.role === 'user') {
        return { role: 'user', content: message.content };
    }

    return {
        role: 'assistant',
        content: message.content.slice(0, streamChatBodyMessagesItemContentMax),
        productIds: message.products
            .slice(0, streamChatBodyMessagesItemProductIdsMax)
            .map(product => product.id)
    };
}

export function toChatRequest(messages: ChatMessage[]): ChatRequest {
    const meaningfulMessages = messages.filter(
        message =>
            message.status !== 'failed' &&
            (message.content.trim() !== '' || message.products.length > 0)
    );
    const recentMessages = meaningfulMessages.slice(-streamChatBodyMessagesMax);
    const firstUserMessageIndex = recentMessages.findIndex(message => message.role === 'user');
    const conversation = recentMessages.slice(Math.max(firstUserMessageIndex, 0));

    return { messages: conversation.map(toChatRequestMessage) };
}

function addNewProducts(shownProducts: Product[], addedProducts: Product[]): Product[] {
    const shownIds = new Set(shownProducts.map(product => product.id));
    const newProducts = addedProducts.filter(product => !shownIds.has(product.id));

    return [...shownProducts, ...newProducts];
}

export function applyReplyEvent(reply: ChatMessage, event: AssistantStreamEvent): ChatMessage {
    switch (event.type) {
        case 'text':
            return { ...reply, content: reply.content + event.text };
        case 'products':
            return { ...reply, products: addNewProducts(reply.products, event.products) };
        case 'error':
            return { ...reply, status: 'failed' };
        case 'done':
            return { ...reply, status: 'complete' };
    }
}
