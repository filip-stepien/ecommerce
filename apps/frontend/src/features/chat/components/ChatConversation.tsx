import {
    Button,
    Center,
    Image,
    Loader,
    Paper,
    ScrollArea,
    Stack,
    Text,
    ThemeIcon,
    UnstyledButton
} from '@mantine/core';
import { Package, Sparkles } from 'lucide-react';
import { Link, generatePath } from 'react-router';
import type { Product } from '@/api/generated/model';
import { useCart } from '@/features/cart/hooks/useCart';
import type { ChatMessage } from '@/features/chat/lib/conversation';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { formatPrice } from '@/lib/format';
import { appRoutes } from '@/lib/routes';

const suggestions = ['Słuchawki do 300 zł', 'Pomóż dobrać laptop', 'Zestaw do pracy z domu'];

const replyFailedMessage = 'Asystent jest chwilowo niedostępny. Spróbuj ponownie za chwilę.';

function ChatWelcome({
    onSend,
    showSuggestions
}: {
    onSend: (value: string) => void;
    showSuggestions: boolean;
}) {
    return (
        <Stack className='items-start gap-3 py-3'>
            <ThemeIcon size={44} radius='xl' variant='light'>
                <Sparkles size={22} />
            </ThemeIcon>
            <Text className='text-lg font-semibold'>Cześć! Czego szukasz?</Text>
            <Text className='text-sm text-dimmed'>
                Napisz, do czego potrzebujesz sprzętu i jaki masz budżet.
            </Text>
            {showSuggestions && (
                <Stack className='mt-1 items-start gap-2'>
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
    );
}

function CustomerMessage({ message }: { message: ChatMessage }) {
    return (
        <Paper className='max-w-[90%] self-end rounded-lg bg-(--mantine-color-blue-8) p-3 text-white'>
            <Text className='mb-1 text-xs font-semibold'>Ty</Text>
            <Text className='text-sm whitespace-pre-wrap wrap-anywhere'>{message.content}</Text>
        </Paper>
    );
}

function ChatProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();

    return (
        <Paper withBorder className='flex items-center gap-3 rounded-lg p-2.5'>
            <UnstyledButton
                component={Link}
                to={generatePath(appRoutes.product, { id: String(product.id) })}
                className='flex min-w-0 flex-1 items-center gap-3'
            >
                {product.imageUrl ? (
                    <Image src={product.imageUrl} alt='' className='size-14 shrink-0 rounded-md' />
                ) : (
                    <Center className='size-14 shrink-0 rounded-md bg-placeholder'>
                        <Package size={22} strokeWidth={1.25} className='text-dimmed' />
                    </Center>
                )}
                <Stack className='min-w-0 gap-0.5'>
                    <Text className='line-clamp-2 text-sm leading-snug font-semibold'>
                        {product.name}
                    </Text>
                    <Text className='text-sm font-bold'>{formatPrice(product.price)}</Text>
                </Stack>
            </UnstyledButton>
            <Button
                size='compact-sm'
                variant='light'
                className='shrink-0'
                onClick={() => addItem(product, { image: product.imageUrl ?? null })}
            >
                Dodaj do koszyka
            </Button>
        </Paper>
    );
}

function AssistantReply({ reply }: { reply: ChatMessage }) {
    const waitingForText = reply.status === 'streaming' && !reply.content;

    return (
        <Stack className='w-full gap-2 self-start'>
            {(reply.content || waitingForText) && (
                <Paper className='max-w-[90%] self-start rounded-lg bg-(--mantine-color-gray-1) p-3 dark:bg-(--mantine-color-dark-6)'>
                    <Text className='mb-1 text-xs font-semibold'>Asystent volt</Text>
                    {waitingForText ? (
                        <Loader type='dots' size='sm' />
                    ) : (
                        <Text className='text-sm whitespace-pre-wrap wrap-anywhere'>
                            {reply.content}
                        </Text>
                    )}
                </Paper>
            )}
            {reply.products.length > 0 && (
                <Stack className='gap-2'>
                    {reply.products.map(product => (
                        <ChatProductCard key={product.id} product={product} />
                    ))}
                </Stack>
            )}
            {reply.status === 'failed' && (
                <Text className='text-sm text-(--mantine-color-error)'>{replyFailedMessage}</Text>
            )}
        </Stack>
    );
}

type ChatConversationProps = {
    messages: ChatMessage[];
    onSend: (value: string) => void;
};

export function ChatConversation({ messages, onSend }: ChatConversationProps) {
    const conversationViewportRef = useScrollToBottom<HTMLDivElement>(messages);

    return (
        <ScrollArea
            className='min-h-0 flex-1'
            viewportRef={conversationViewportRef}
            offsetScrollbars
        >
            <Stack className='gap-4 p-4'>
                <ChatWelcome onSend={onSend} showSuggestions={messages.length === 0} />
                <Stack className='gap-3'>
                    {messages.map(message =>
                        message.role === 'user' ? (
                            <CustomerMessage key={message.id} message={message} />
                        ) : (
                            <AssistantReply key={message.id} reply={message} />
                        )
                    )}
                </Stack>
            </Stack>
        </ScrollArea>
    );
}
