import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

import store from "@/stores/store";
import {
    getChildren,
    getFullPath,
    getItem,
    getRecursiveItemIds,
    getSelectedItem,
    toList,
} from "@/stores/directory";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDirectory = (itemId: string) => {
    const { directory } = useAppSelector(
        (state: RootState) => ({
            directory: toList(state.directory),
        }),
        shallowEqual
    );

    const item = getItem(directory, itemId);
    const firstLayerChildren = getChildren(directory, itemId);
    const children = getRecursiveItemIds(directory, itemId);
    const selectedItem = getSelectedItem(directory, itemId);
    const path = getFullPath(directory, itemId);

    return {
        directory,
        item,
        firstLayerChildren,
        children,
        selectedItem,
        path,
    };
};
