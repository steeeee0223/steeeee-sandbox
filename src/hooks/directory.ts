import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { SandpackFiles } from "@codesandbox/sandpack-react/types";

import { AppDispatch, useAppDispatch, useAppSelector } from "@/hooks";
import {
    CopiedItems,
    DirectoryItem,
    File,
    Folder,
    SelectedItem,
    directorySelector,
    getChildren,
    getFullPath,
    getRecursiveItemIds,
    getSelectedItem,
    selectItem,
} from "@/stores/directory";

const _never: never = undefined as never;

interface DirectoryInfo {
    directory: DirectoryItem[];
    currentItem: SelectedItem;
    copiedItems: CopiedItems | null;
    projectId: string;
    bundledFiles: SandpackFiles;
}

interface DirectoryOperations {
    getFiles: () => File[];
    getFolders: () => Folder[];
    getItem: (itemId: string) => DirectoryItem;
    getPath: (itemId: string) => readonly [string[], string[]];
    getFirstLayerChildren: (itemId: string) => DirectoryItem[];
    getAllChildren: (itemId: string) => {
        folderIds: string[];
        fileIds: string[];
    };
    select: (itemId: string) => SelectedItem;
    isCurrentItem: (itemId: string) => boolean;
    isFolderPresent: (itemId: string, folderName: string) => boolean;
    isFilePresent: (itemId: string, fileName: string) => boolean;
    bundleFiles: () => SandpackFiles;
}

export function useDirectory(): DirectoryInfo & DirectoryOperations {
    const dispatch = useAppDispatch();
    const { directoryState, currentItem, copiedItems, projectId } =
        useAppSelector(
            (state) => ({
                directoryState: state.directory,
                currentItem: state.directory.currentItem,
                copiedItems: state.directory.copiedItems,
                projectId: state.project.currentProject?.id,
            }),
            shallowEqual
        );

    const directory = directorySelector.selectAll(directoryState);
    const getFiles = () =>
        directory.filter(({ isFolder }) => !isFolder) as File[];
    const getFolders = () =>
        directory.filter(({ isFolder }) => isFolder) as Folder[];
    const getItem = (itemId: string) =>
        directory.find((item) => itemId === item.itemId) ?? _never;
    const getPath = (itemId: string) => getFullPath(directory, itemId);
    const getFirstLayerChildren = (itemId: string) =>
        getChildren(directory, itemId);
    const getAllChildren = (itemId: string) =>
        getRecursiveItemIds(directory, itemId);
    const select = (itemId: string) => {
        const item = getSelectedItem(directory, itemId);
        dispatch(selectItem(item));
        return item;
    };
    const isCurrentItem = (itemId: string) => currentItem.item.id === itemId;

    const isFolderPresent = (itemId: string, folderName: string): boolean => {
        return !!directory.find(
            ({ isFolder, parent, name }) =>
                isFolder && parent === itemId && name === folderName
        );
    };
    const isFilePresent = (itemId: string, fileName: string): boolean => {
        return !!directory.find(
            ({ isFolder, parent, name }) =>
                !isFolder && parent === itemId && name === fileName
        );
    };

    const bundleFiles = () => {
        const bundledFiles: SandpackFiles = {};
        getFiles().forEach(({ itemId, content }) => {
            const [pathName, _] = getPath(itemId);
            /**
             * @var path
             * @example ['root', 'App.tsx'] -> `root/App.tsx` -> `/App.tsx`
             */
            const path = pathName.join("/").slice(4);
            bundledFiles[path] = content;
        });
        return bundledFiles;
    };

    const [bundledFiles, setBundledFiles] = useState<SandpackFiles>({});

    useEffect(() => {
        setBundledFiles(bundleFiles());
    }, [directoryState]);

    return {
        projectId,
        directory,
        currentItem,
        copiedItems,
        bundledFiles,
        bundleFiles,
        getFiles,
        getFolders,
        getItem,
        getFirstLayerChildren,
        getAllChildren,
        getPath,
        select,
        isCurrentItem,
        isFolderPresent,
        isFilePresent,
    };
}
