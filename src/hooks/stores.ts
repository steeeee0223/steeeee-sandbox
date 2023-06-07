import { shallowEqual } from "react-redux";

import {
    getChildren,
    getFullPath,
    getItem,
    getRecursiveItemIds,
    getSelectedItem,
    toList,
} from "@/stores/directory";
import { RootState, useAppSelector } from "./hooks";

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
