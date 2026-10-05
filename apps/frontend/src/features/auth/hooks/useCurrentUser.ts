import { type RequestError, toRequestError } from '@/api/error';
import type { CurrentUser } from '@/api/generated/model';
import { useGetCurrentUser } from '@/api/generated/users/users';
import { useDebugQuery } from '@/hooks/useDebugQuery';
import { Env } from '@/lib/env';
import { useAuth } from './useAuth';

export type User = {
    username: string;
    email: string | null;
    roles: string[];
};

export type UseCurrentUserResult = {
    user: User | null;
    isLoading: boolean;
    error: RequestError | null;
};

function toUser(currentUser: CurrentUser): User {
    return {
        username: currentUser.username,
        email: currentUser.email ?? null,
        roles: currentUser.roles
    };
}

function useApiCurrentUser(): UseCurrentUserResult {
    const { isAuthenticated } = useAuth();
    const { data, isLoading, error } = useGetCurrentUser({
        query: { enabled: isAuthenticated, select: toUser }
    });

    return {
        user: data ?? null,
        isLoading,
        error: error ? toRequestError(error) : null
    };
}

function useDebugCurrentUser(): UseCurrentUserResult {
    const { data, isLoading } = useDebugQuery<User>({
        username: 'user',
        email: 'user@example.com',
        roles: ['user']
    });

    return {
        user: data ?? null,
        isLoading,
        error: null
    };
}

export const useCurrentUser = Env.isDebug ? useDebugCurrentUser : useApiCurrentUser;
