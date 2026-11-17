import { type RefObject, useEffect, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>(content: unknown): RefObject<T | null> {
    const containerRef = useRef<T>(null);

    useEffect(() => {
        const container = containerRef.current;
        container?.scrollTo({ top: container.scrollHeight });
    }, [content]);

    return containerRef;
}
