import { useRef } from 'react';
import {
    ActionIcon,
    Affix,
    CloseButton,
    Drawer,
    Group,
    Paper,
    Stack,
    Text,
    Transition
} from '@mantine/core';
import { useDisclosure, useMediaQuery, useReducedMotion } from '@mantine/hooks';
import { MessageCircle, X } from 'lucide-react';
import { ChatComposer } from '@/features/chat/components/ChatComposer';
import { ChatConversation } from '@/features/chat/components/ChatConversation';
import { useChat } from '@/features/chat/hooks/useChat';

export function ChatWidget() {
    const chat = useChat();
    const [opened, { toggle, close: closeChat }] = useDisclosure(false);
    const mobile = useMediaQuery('(max-width: 47.99em)');
    const reducedMotion = useReducedMotion();
    const launcher = useRef<HTMLButtonElement>(null);

    function close() {
        closeChat();
        launcher.current?.focus();
    }

    const content = (
        <>
            <ChatConversation
                messages={chat.messages}
                replying={chat.replying}
                onSend={chat.sendMessage}
            />
            <ChatComposer
                replying={chat.replying}
                onSend={chat.sendMessage}
                onStop={chat.stopReply}
            />
        </>
    );

    return (
        <>
            <Affix position={{ bottom: 24, right: 24 }} zIndex={190}>
                <Stack align='flex-end' gap='md'>
                    <Transition
                        mounted={opened && !mobile}
                        transition='slide-up'
                        duration={reducedMotion ? 0 : 180}
                    >
                        {styles => (
                            <Paper
                                id='shopping-chat-desktop'
                                role='dialog'
                                aria-label='Asystent volt'
                                withBorder
                                shadow='xl'
                                radius='lg'
                                style={{
                                    ...styles,
                                    width: 380,
                                    height: 'min(540px, calc(100dvh - 120px))',
                                    maxWidth: 'calc(100vw - 48px)'
                                }}
                                className='flex flex-col overflow-hidden'
                                onKeyDown={event => {
                                    if (event.key === 'Escape') {
                                        event.stopPropagation();
                                        close();
                                    }
                                }}
                            >
                                <Group
                                    justify='space-between'
                                    p='md'
                                    className='shrink-0 border-b border-default-border'
                                >
                                    <Text fw={600}>Asystent volt</Text>
                                    <CloseButton onClick={close} aria-label='Zamknij czat' />
                                </Group>
                                {content}
                            </Paper>
                        )}
                    </Transition>
                    <ActionIcon
                        ref={launcher}
                        size={56}
                        radius='xl'
                        className='shadow-lg'
                        onClick={toggle}
                        aria-label={opened ? 'Zamknij czat' : 'Otwórz czat z asystentem'}
                        aria-expanded={opened}
                        aria-controls={
                            opened
                                ? mobile
                                    ? 'shopping-chat-mobile'
                                    : 'shopping-chat-desktop'
                                : undefined
                        }
                    >
                        {opened ? <X size={25} /> : <MessageCircle size={25} />}
                    </ActionIcon>
                </Stack>
            </Affix>
            <Drawer
                opened={opened && !!mobile}
                onClose={close}
                position='bottom'
                size='100%'
                title='Asystent volt'
                closeButtonProps={{ 'aria-label': 'Zamknij czat' }}
                transitionProps={{ duration: reducedMotion ? 0 : 180 }}
                classNames={{
                    content: 'flex h-dvh flex-col',
                    body: 'flex min-h-0 flex-1 flex-col p-0',
                    title: 'font-semibold'
                }}
            >
                <div
                    id='shopping-chat-mobile'
                    className='flex min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)]'
                >
                    {content}
                </div>
            </Drawer>
        </>
    );
}
