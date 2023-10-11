import { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { SandpackFiles } from "@codesandbox/sandpack-react/types";

import { useAppDispatch, useAppSelector } from "@/hooks";
import {
    createFileAsync,
    createFolderAsync,
    deleteDirectoryAsync,
    directorySelector,
    getChildren,
    getDirectoryAsync,
    getFullPath,
    getRecursiveItemIds,
    getSelectedItem,
    renameDirectoryItemAsync,
    selectItem,
    setAction,
    uploadFileAsync,
} from "@/stores/directory";
import { getContent, getExtension, normalizePath } from "@/lib/file";
import { projectSelector } from "@/stores/project";
import { setCreation } from "@/stores/cursor";
import {
    CreationType,
    DirectoryAction,
    DirectoryItem,
    DirectoryItemType,
    File,
    Folder,
    Project,
    SelectedItem,
    UploadFile,
} from "@/types";

const nullProject = {} as Project;

interface DirectoryInfo {
    project: Project;
    directory: DirectoryItem[];
    action: DirectoryAction;
    currentItem: SelectedItem;
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
    reload: (userId: string, projectId: string) => void;
    select: (itemId: string) => SelectedItem;
    create: (
        type: Exclude<CreationType, null>,
        name: string,
        file?: UploadFile
    ) => void;
    rename: (type: DirectoryItemType, itemId: string, name: string) => void;
    remove: (itemId: string) => void;
    copy: (itemId: string) => void;
    updateAction: (action: DirectoryAction) => void;
    bundleFiles: () => SandpackFiles;
}

export function useDirectory(): DirectoryInfo & DirectoryOperations {
    const dispatch = useAppDispatch();
    const {
        directoryState,
        action,
        currentItem,
        projectState,
        currentProject,
    } = useAppSelector(
        (state) => ({
            directoryState: state.directory,
            action: state.directory.action,
            currentItem: state.directory.currentItem,
            projectState: state.project,
            currentProject: state.project.currentProject,
        }),
        shallowEqual
    );

    const [bundledFiles, setBundledFiles] = useState<SandpackFiles>({});
    const project = useMemo(
        () =>
            currentProject
                ? projectSelector.selectById(projectState, currentProject.id)!
                : nullProject,
        [projectState]
    );

    const directory = directorySelector.selectAll(directoryState);

    /** Utils */
    /** Is folder present in the 1st layer children of `itemId` */
    const isFolderPresent = (itemId: string, folderName: string) =>
        !!directory.find(
            ({ isFolder, parent, name }) =>
                isFolder && parent === itemId && name === folderName.trim()
        );
    /** Is file present in the 1st layer children of `itemId` */
    const isFilePresent = (itemId: string, fileName: string) =>
        !!directory.find(
            ({ isFolder, parent, name }) =>
                !isFolder && parent === itemId && name === fileName.trim()
        );
    const getFiles = () =>
        directory.filter(({ isFolder }) => !isFolder) as File[];
    const getPath = (itemId: string) => getFullPath(directory, itemId);
    const getItem = (itemId: string) =>
        directory.find((item) => itemId === item.itemId)!;
    const getAllChildren = (itemId: string) =>
        getRecursiveItemIds(directory, itemId);
    const updateAction = (action: DirectoryAction) =>
        dispatch(setAction(action));
    const setDuplicateFilename = (filename: string): string => {
        if (!isFilePresent(currentItem.item.id, filename)) return filename;
        const split = filename.split(".");
        if (split.length === 0) {
            return `${filename}-2`;
        }
        const ext = split.pop()!;
        return `${split.join(".")}-2.${ext}`;
    };

    /** Directory Information */
    const info: DirectoryInfo = {
        project,
        directory,
        action,
        bundledFiles: {},
        currentItem,
        isCurrentItem: (itemId) => currentItem.item.id === itemId,
        isFolderPresent,
        isFilePresent,
        isItemPresent: (type, itemId, name) =>
            (type === "folder" ? isFolderPresent : isFilePresent)(itemId, name),
    };

    /** Directory Operations */
    const operations: DirectoryOperations = {
        getFiles,
        getFolders: () =>
            directory.filter(({ isFolder }) => isFolder) as Folder[],
        getPath,
        getItem,
        getFirstLayerChildren: (itemId) => getChildren(directory, itemId),
        getAllChildren,
        updateAction,
        select: (itemId) => {
            const item = getSelectedItem(directory, itemId);
            dispatch(selectItem(item));
            return item;
        },
        reload: (userId, projectId) =>
            dispatch(getDirectoryAsync({ userId, projectId })),
        create: async (type, name, file) => {
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
                    data = {
                        ...data,
                        content: "",
                        extension: getExtension(name),
                    };
                    dispatch(createFileAsync({ project, data }));
                    break;
                case "upload":
                    const uploadFile = file!;
                    data = {
                        ...data,
                        content: await getContent(uploadFile),
                        name: setDuplicateFilename(uploadFile.name),
                        extension: getExtension(uploadFile.name),
                    };
                    dispatch(uploadFileAsync({ project, uploadFile, data }));
                    break;
            }
        },
        rename: (type, itemId, name) => {
            console.log(`[renameItem] ${type} => ${itemId}`);
            dispatch(
                renameDirectoryItemAsync({
                    project,
                    item: getItem(itemId),
                    name,
                })
            );
            updateAction({ rename: null });
        },
        remove: (itemId) => dispatch(deleteDirectoryAsync({ project, itemId })),
        copy: (itemId) =>
            updateAction({
                copy: { rootId: itemId, items: getAllChildren(itemId) },
            }),

        bundleFiles: () => {
            const bundledFiles: SandpackFiles = {};
            getFiles().forEach(({ itemId, content }) => {
                const [pathName, _] = getPath(itemId);
                const path = normalizePath(pathName);
                bundledFiles[path] = content;
            });
            return bundledFiles;
        },
    };

    useEffect(() => {
        setBundledFiles(operations.bundleFiles());
    }, [directoryState]);

    return { ...info, bundledFiles, ...operations };
}
