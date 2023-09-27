import { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { SandpackFiles } from "@codesandbox/sandpack-react/types";

import { useAppDispatch, useAppSelector } from "@/hooks";
import {
    DirectoryAction,
    DirectoryItem,
    File,
    Folder,
    SelectedItem,
    UploadFile,
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
import { Project, projectSelector } from "@/stores/project";
import { CreationType, DirectoryItemType, setCreation } from "@/stores/cursor";

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

    const project = useMemo(
        () =>
            currentProject
                ? projectSelector.selectById(projectState, currentProject.id)!
                : nullProject,
        [projectState]
    );

    const directory = directorySelector.selectAll(directoryState);
    const getFiles: DirectoryOperations["getFiles"] = () =>
        directory.filter(({ isFolder }) => !isFolder) as File[];
    const getFolders: DirectoryOperations["getFolders"] = () =>
        directory.filter(({ isFolder }) => isFolder) as Folder[];
    const getItem: DirectoryOperations["getItem"] = (itemId) =>
        directory.find((item) => itemId === item.itemId)!;
    const getPath: DirectoryOperations["getPath"] = (itemId) =>
        getFullPath(directory, itemId);

    const getFirstLayerChildren: DirectoryOperations["getFirstLayerChildren"] =
        (itemId) => getChildren(directory, itemId);
    const getAllChildren: DirectoryOperations["getAllChildren"] = (itemId) =>
        getRecursiveItemIds(directory, itemId);
    const select: DirectoryOperations["select"] = (itemId) => {
        const item = getSelectedItem(directory, itemId);
        dispatch(selectItem(item));
        return item;
    };
    const isCurrentItem: DirectoryInfo["isCurrentItem"] = (itemId) =>
        currentItem.item.id === itemId;

    /** Is folder present in the 1st layer children of `itemId` */
    const isFolderPresent: DirectoryInfo["isFolderPresent"] = (
        itemId,
        folderName
    ) =>
        !!directory.find(
            ({ isFolder, parent, name }) =>
                isFolder && parent === itemId && name === folderName.trim()
        );
    /** Is file present in the 1st layer children of `itemId` */
    const isFilePresent: DirectoryInfo["isFilePresent"] = (itemId, fileName) =>
        !!directory.find(
            ({ isFolder, parent, name }) =>
                !isFolder && parent === itemId && name === fileName.trim()
        );
    const isItemPresent: DirectoryInfo["isItemPresent"] = (
        type,
        itemId,
        name
    ) => (type === "folder" ? isFolderPresent : isFilePresent)(itemId, name);

    const setDuplicateFilename = (filename: string): string => {
        if (!isFilePresent(currentItem.item.id, filename)) return filename;
        const split = filename.split(".");
        if (split.length === 0) {
            return `${filename}-2`;
        }
        const ext = split.pop()!;
        return `${split.join(".")}-2.${ext}`;
    };

    const updateAction = (action: DirectoryAction) =>
        dispatch(setAction(action));

    const reload: DirectoryOperations["reload"] = (userId, projectId) =>
        dispatch(getDirectoryAsync({ userId, projectId }));
    const create: DirectoryOperations["create"] = async (type, name, file) => {
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
    };
    const rename: DirectoryOperations["rename"] = (type, itemId, name) => {
        console.log(`[renameItem] ${type} => ${itemId}`);
        dispatch(
            renameDirectoryItemAsync({ project, item: getItem(itemId), name })
        );
        updateAction({ rename: null });
    };
    const remove: DirectoryOperations["remove"] = (itemId) =>
        dispatch(deleteDirectoryAsync({ project, itemId }));
    const copy: DirectoryOperations["copy"] = (itemId) =>
        updateAction({
            copy: { rootId: itemId, items: getAllChildren(itemId) },
        });
    const bundleFiles: DirectoryOperations["bundleFiles"] = () => {
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
        action,
        currentItem,
        bundledFiles,
        bundleFiles,
        getFiles,
        getFolders,
        getItem,
        getFirstLayerChildren,
        getAllChildren,
        getPath,
        updateAction,
        reload,
        select,
        create,
        rename,
        remove,
        copy,
        isCurrentItem,
        isFolderPresent,
        isFilePresent,
        isItemPresent,
    };
}
