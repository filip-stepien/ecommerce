import { ActionIcon, Group, Text, Textarea } from '@mantine/core';
import { Send } from 'lucide-react';
import { messageMaxLength } from '@/features/chat/hooks/useChat';

type ChatComposerProps = {
    value: string;
    onChange: (value: string) => void;
    onSend: (value: string) => void;
};

export function ChatComposer({ value, onChange, onSend }: ChatComposerProps) {
    return (
        <form
            className='shrink-0 border-t border-default-border p-4'
            onSubmit={event => {
                event.preventDefault();
                onSend(value);
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
                    value={value}
                    onChange={event => onChange(event.currentTarget.value)}
                    onKeyDown={event => {
                        if (
                            event.key === 'Enter' &&
                            !event.shiftKey &&
                            !event.nativeEvent.isComposing
                        ) {
                            event.preventDefault();
                            onSend(value);
                        }
                    }}
                />
                <ActionIcon
                    type='submit'
                    size={38}
                    radius='md'
                    disabled={!value.trim()}
                    aria-label='Wyślij wiadomość'
                >
                    <Send size={18} />
                </ActionIcon>
            </Group>
            <Text size='xs' c='dimmed' mt={8}>
                {value.length}/{messageMaxLength}
            </Text>
        </form>
    );
}
