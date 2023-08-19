import { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { SandpackFiles } from "@codesandbox/sandpack-react/types";

import { useAppDispatch, useAppSelector } from "@/hooks";
import {
    CopiedItems,
    DirectoryItem,
    File,
    Folder,
    SelectedItem,
    UploadFile,
    createFileAsync,
    createFolderAsync,
    directorySelector,
    getChildren,
    getFullPath,
    getRecursiveItemIds,
    getSelectedItem,
    renameDirectoryItemAsync,
    selectItem,
    uploadFileAsync,
} from "@/stores/directory";
import { getContent, getExtension, normalizePath } from "@/lib/file";
import { _never } from "@/lib/helper";
import { Project, projectSelector } from "@/stores/project";
import {
    CreationType,
    DirectoryItemType,
    setCreation,
    setRenameItem,
} from "@/stores/cursor";

const nullProject = {} as Project;

interface DirectoryInfo {
    renameItem: string | null;
    project: Project;
    directory: DirectoryItem[];
    currentItem: SelectedItem;
    copiedItems: CopiedItems | null;
    bundledFiles: SandpackFiles;
    isCurrentItem: (itemId: string) => boolean;
    isFolderPresent: (itemId: string, folderName: string) => boolean;
    isFilePresent: (itemId: string, fileName: string) => boolean;
    isItemPresent: (
        type: DirectoryItemType,
        itemId: string,
        fileName: string
    ) => boolean;
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
    createItem: (
        type: Exclude<CreationType, null>,
        name: string,
        file?: UploadFile
    ) => void;
    rename: (type: DirectoryItemType, itemId: string, name: string) => void;
    resetRenameItem: () => void;
    bundleFiles: () => SandpackFiles;
}

export function useDirectory(): DirectoryInfo & DirectoryOperations {
    const dispatch = useAppDispatch();
    const {
        renameItem,
        directoryState,
        currentItem,
        copiedItems,
        projectState,
        currentProject,
    } = useAppSelector(
        (state) => ({
            renameItem: state.cursor.renameItem,
            directoryState: state.directory,
            currentItem: state.directory.currentItem,
            copiedItems: state.directory.copiedItems,
            projectState: state.project,
            currentProject: state.project.currentProject,
        }),
        shallowEqual
    );

    const project = useMemo(
        () =>
            currentProject
                ? projectSelector.selectById(projectState, currentProject.id) ??
                  _never
                : nullProject,
        [projectState]
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

    /** Is folder present in the 1st layer children of `itemId` */
    const isFolderPresent = (itemId: string, folderName: string): boolean => {
        return !!directory.find(
            ({ isFolder, parent, name }) =>
                isFolder && parent === itemId && name === folderName.trim()
        );
    };
    /** Is file present in the 1st layer children of `itemId` */
    const isFilePresent = (itemId: string, fileName: string): boolean => {
        return !!directory.find(
            ({ isFolder, parent, name }) =>
                !isFolder && parent === itemId && name === fileName.trim()
        );
    };
    const isItemPresent = (
        type: DirectoryItemType,
        itemId: string,
        name: string
    ): boolean =>
        type === "folder"
            ? isFolderPresent(itemId, name)
            : isFilePresent(itemId, name);

    const setDuplicateFilename = (filename: string): string => {
        if (!isFilePresent(currentItem.item.id, filename)) return filename;
        const split = filename.split(".");
        if (split.length === 0) {
            return `${filename}-2`;
        }
        const ext = split.pop() ?? _never;
        return `${split.join(".")}-2.${ext}`;
    };

    const createItem = async (
        type: Exclude<CreationType, null>,
        name: string,
        file?: UploadFile
    ) => {
        const { item, path } = currentItem;
        dispatch(setCreation(null));
        let data: any = {
            name,
            parent: item.id,
            path: [...path.name, item.name],
        };
        switch (type) {
            case "folder":
                dispatch(createFolderAsync({ project, data }));
                break;
            case "file":
                data = { ...data, content: "", extension: getExtension(name) };
                dispatch(createFileAsync({ project, data }));
                break;
            case "upload":
                const uploadFile = file ?? _never;
                data = {
                    ...data,
                    content: await getContent(uploadFile),
                    name: setDuplicateFilename(uploadFile.name),
                    extension: getExtension(uploadFile.name),
                };
                dispatch(uploadFileAsync({ project, uploadFile, data }));
                break;
        }
    };

    const resetRenameItem = () => {
        dispatch(setRenameItem(null));
    };

    const rename = (type: DirectoryItemType, itemId: string, name: string) => {
        console.log(`[renameItem] ${type} => ${itemId}`);
        dispatch(
            renameDirectoryItemAsync({ project, item: getItem(itemId), name })
        );
        resetRenameItem();
    };

    const bundleFiles = () => {
        const bundledFiles: SandpackFiles = {};
        getFiles().forEach(({ itemId, content }) => {
            const [pathName, _] = getPath(itemId);
            const path = normalizePath(pathName);
            bundledFiles[path] = content;
        });
        return bundledFiles;
    };

    const [bundledFiles, setBundledFiles] = useState<SandpackFiles>({});

    useEffect(() => {
        setBundledFiles(bundleFiles());
    }, [directoryState]);

    return {
        project,
        directory,
        currentItem,
        renameItem,
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
        createItem,
        rename,
        resetRenameItem,
        isCurrentItem,
        isFolderPresent,
        isFilePresent,
        isItemPresent,
    };
}
