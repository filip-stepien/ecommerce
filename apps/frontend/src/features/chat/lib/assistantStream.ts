import { EventSourceParserStream } from 'eventsource-parser/stream';
import { ApiError } from '@/api/error';
import { getStreamChatUrl } from '@/api/generated/assistant/assistant';
import type { AssistantStreamEvent, ChatRequest } from '@/api/generated/model';
import { AssistantStreamEvent as assistantStreamEventSchema } from '@/api/zod/model/assistantStreamEvent.zod';
import { createAuthorizedHeaders } from '@/features/auth/lib/token';

export class AssistantStreamError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AssistantStreamError';
    }
}

function parseAssistantStreamEvent(data: string): AssistantStreamEvent {
    const result = assistantStreamEventSchema.safeParse(JSON.parse(data));

    if (!result.success) {
        throw new AssistantStreamError('Asystent przysłał dane w nieoczekiwanym formacie.');
    }

    return result.data;
}

export async function fetchAssistantReply(
    request: ChatRequest,
    onEvent: (event: AssistantStreamEvent) => void,
    signal: AbortSignal
): Promise<void> {
    const headers = await createAuthorizedHeaders({
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
    });

    const response = await fetch(getStreamChatUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
        signal
    });

    if (!response.ok || !response.body) {
        throw new ApiError(response.status, await response.text());
    }

    const messages = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream({ onError: 'terminate' }))
        .getReader();

    try {
        for (;;) {
            const { value: message, done } = await messages.read();
            if (done) break;

            const event = parseAssistantStreamEvent(message.data);
            onEvent(event);

            if (event.type === 'done' || event.type === 'error') return;
        }
    } finally {
        messages.releaseLock();
    }

    throw new AssistantStreamError('Odpowiedź asystenta urwała się przed końcem.');
}
