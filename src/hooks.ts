import { createContext, useContext } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import store from "@/stores/store";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * A helper to create a Context and Provider with no upfront default value, and
 * without having to check for undefined all the time.
 */
export function createCtx<A extends {} | null>() {
    const ctx = createContext<A | undefined>(undefined);
    function useCtx(): A {
        const c = useContext<A | undefined>(ctx);
        if (c === undefined)
            throw new Error("useCtx must be inside a Provider with a value");
        return c;
    }
    return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}
