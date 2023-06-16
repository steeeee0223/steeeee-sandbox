import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

import store from "@/stores/store";
import {
    directorySelector,
    getChildren,
    getFullPath,
    getItem,
    getRecursiveItemIds,
    getSelectedItem,
} from "@/stores/directory";
import { projectSelector } from "@/stores/project";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDirectory = (itemId: string) => {
    const { directoryState } = useAppSelector(
        (state) => ({ directoryState: state.directory }),
        shallowEqual
    );
    const directory = directorySelector.selectAll(directoryState);
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

export const useProjects = () => {
    const { projectState } = useAppSelector(
        (state) => ({ projectState: state.project }),
        shallowEqual
    );
    const projects = projectSelector.selectAll(projectState);
    const isProjectPresent = (projectName: string): boolean => {
        const projectPresent = projects.find(
            ({ name }) => projectName === name
        );
        return !!projectPresent;
    };
    return { projects, isProjectPresent };
};
