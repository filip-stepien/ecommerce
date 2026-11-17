import type { PropsWithChildren } from 'react';
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
import { useDisclosure } from '@mantine/hooks';
import { MessageCircle, X } from 'lucide-react';
import { ChatComposer } from '@/features/chat/components/ChatComposer';
import { ChatConversation } from '@/features/chat/components/ChatConversation';
import { useChat } from '@/features/chat/hooks/useChat';
import { useIsMobile } from '@/hooks/useIsMobile';

type ChatContainerProps = PropsWithChildren<{
    opened: boolean;
    onClose: () => void;
}>;

function ChatLauncher({ opened, onToggle }: { opened: boolean; onToggle: () => void }) {
    return (
        <ActionIcon
            size={56}
            radius='xl'
            className='shadow-lg'
            onClick={onToggle}
            aria-label={opened ? 'Zamknij czat' : 'Otwórz czat z asystentem'}
        >
            {opened ? <X size={25} /> : <MessageCircle size={25} />}
        </ActionIcon>
    );
}

function ChatWindow({ opened, onClose, children }: ChatContainerProps) {
    return (
        <Transition mounted={opened} transition='slide-up' duration={180}>
            {transitionStyles => (
                <Paper
                    withBorder
                    shadow='xl'
                    style={transitionStyles}
                    className='flex h-[min(540px,calc(100dvh-120px))] w-[380px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl'
                    onKeyDown={event => {
                        if (event.key === 'Escape') {
                            event.stopPropagation();
                            onClose();
                        }
                    }}
                >
                    <Group className='shrink-0 justify-between border-b border-default-border p-4'>
                        <Text className='font-semibold'>Asystent volt</Text>
                        <CloseButton onClick={onClose} aria-label='Zamknij czat' />
                    </Group>
                    {children}
                </Paper>
            )}
        </Transition>
    );
}

function ChatDrawer({ opened, onClose, children }: ChatContainerProps) {
    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position='bottom'
            size='100%'
            title='Asystent volt'
            closeButtonProps={{ 'aria-label': 'Zamknij czat' }}
            transitionProps={{ duration: 180 }}
            classNames={{
                content: 'flex h-dvh flex-col',
                body: 'flex min-h-0 flex-1 flex-col p-0',
                title: 'font-semibold'
            }}
        >
            <div className='flex min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)]'>
                {children}
            </div>
        </Drawer>
    );
}

export function ChatWidget() {
    const chat = useChat();
    const [opened, { toggle, close }] = useDisclosure(false);
    const isMobile = useIsMobile();

    const chatContent = (
        <>
            <ChatConversation messages={chat.messages} onSend={chat.sendMessage} />
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
                <Stack className='items-end gap-4'>
                    <ChatWindow opened={opened && !isMobile} onClose={close}>
                        {chatContent}
                    </ChatWindow>
                    <ChatLauncher opened={opened} onToggle={toggle} />
                </Stack>
            </Affix>
            <ChatDrawer opened={opened && isMobile} onClose={close}>
                {chatContent}
            </ChatDrawer>
        </>
    );
}
