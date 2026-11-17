import { useState } from 'react';
import { ActionIcon, Group, Text, Textarea } from '@mantine/core';
import { Send, Square } from 'lucide-react';
import { messageMaxLength } from '@/features/chat/lib/conversation';

type ChatComposerProps = {
    replying: boolean;
    onSend: (value: string) => void;
    onStop: () => void;
};

export function ChatComposer({ replying, onSend, onStop }: ChatComposerProps) {
    const [draft, setDraft] = useState('');

    function sendDraft() {
        if (replying || !draft.trim()) return;

        onSend(draft);
        setDraft('');
    }

    return (
        <form
            className='shrink-0 border-t border-default-border p-4'
            onSubmit={event => {
                event.preventDefault();
                sendDraft();
            }}
        >
            <Group align='flex-end' wrap='nowrap' gap='xs'>
                <Textarea
                    className='min-w-0 flex-1'
                    aria-label='Wiadomość do asystenta'
                    placeholder='Jakiego sprzętu szukasz?'
                    autosize
                    minRows={1}
                    maxRows={4}
                    maxLength={messageMaxLength}
                    value={draft}
                    onChange={event => setDraft(event.currentTarget.value)}
                    onKeyDown={event => {
                        if (
                            event.key === 'Enter' &&
                            !event.shiftKey &&
                            !event.nativeEvent.isComposing
                        ) {
                            event.preventDefault();
                            sendDraft();
                        }
                    }}
                />
                {replying ? (
                    <ActionIcon
                        size={38}
                        radius='md'
                        variant='light'
                        onClick={onStop}
                        aria-label='Zatrzymaj odpowiedź'
                    >
                        <Square size={16} fill='currentColor' />
                    </ActionIcon>
                ) : (
                    <ActionIcon
                        type='submit'
                        size={38}
                        radius='md'
                        disabled={!draft.trim()}
                        aria-label='Wyślij wiadomość'
                    >
                        <Send size={18} />
                    </ActionIcon>
                )}
            </Group>
            <Text size='xs' c='dimmed' mt={8}>
                {draft.length}/{messageMaxLength}
            </Text>
        </form>
    );
}
