import { type RequestError, toRequestError } from '@/api/error';
import type { CurrentUser } from '@/api/generated/model';
import { useGetCurrentUser } from '@/api/generated/users/users';
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

export function useCurrentUser(): UseCurrentUserResult {
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
