import { SelectedItem, DirectoryItem, File, UpdatePath } from "./directory";

const nothing: never = undefined as never;

export function getChildren(
    directory: DirectoryItem[],
    itemId: string,
    sort: boolean = true
): DirectoryItem[] {
    const items = directory.filter((item) => item.parent === itemId);
    if (sort) {
        items.sort((item1, item2) => item1.name.localeCompare(item2.name));
    }
    return items;
}

export function getItem(
    directory: DirectoryItem[],
    itemId: string
): DirectoryItem {
    const item = directory.find((item) => itemId === item.itemId);
    return item ?? nothing;
}

export function getFilesByIds(
    directory: DirectoryItem[],
    fileIds: string[]
): File[] {
    return directory.filter(({ itemId }) => fileIds.includes(itemId)) as File[];
}

export function getFullPath(
    directory: DirectoryItem[],
    itemId: string
): readonly [string[], string[]] {
    let pathName: string[] = [];
    let pathId: string[] = [];
    while (itemId !== "root") {
        const { parent, name } = getItem(directory, itemId);
        pathId.push(itemId);
        pathName.push(name);
        itemId = parent;
    }
    pathId = [...pathId, itemId].reverse();
    pathName = [...pathName, "root"].reverse();
    return [pathName, pathId] as const;
}

export function getSelectedItem(
    directory: DirectoryItem[],
    itemId: string
): SelectedItem {
    const [name, id] = getFullPath(directory, itemId);
    let isFolder = true;
    if (itemId !== "root") {
        isFolder = getItem(directory, itemId).isFolder;
    }
    const item = {
        isFolder,
        name: name.pop() ?? nothing,
        id: id.pop() ?? nothing,
    };
    return { item, path: { name, id } };
}

/**
 *
 * @param itemId
 * @returns all items under directory/file `itemId`, including `itemId` itself
 */
export function getRecursiveItemIds(
    directory: DirectoryItem[],
    itemId: string
): {
    folderIds: string[];
    fileIds: string[];
} {
    if (itemId === "root")
        return {
            folderIds: directory
                .filter(({ isFolder }) => isFolder)
                .map(({ itemId }) => itemId),
            fileIds: directory
                .filter(({ isFolder }) => !isFolder)
                .map(({ itemId }) => itemId),
        };

    const folderIds: string[] = [];
    const fileIds: string[] = [];
    const { isFolder } = getItem(directory, itemId);
    if (isFolder) {
        folderIds.push(itemId);
        const getItems = (itemId: string) => {
            getChildren(directory, itemId, false).forEach((child) => {
                if (child.isFolder) {
                    folderIds.push(child.itemId);
                    getItems(child.itemId);
                } else {
                    fileIds.push(child.itemId);
                }
            });
        };
        getItems(itemId);
    } else {
        fileIds.push(itemId);
    }
    return { folderIds, fileIds };
}

export function updatePaths(
    directory: DirectoryItem[],
    folderId: string
): {
    folders: UpdatePath[];
    files: UpdatePath[];
} {
    const folders: UpdatePath[] = [];
    const files: UpdatePath[] = [];

    const { folderIds, fileIds } = getRecursiveItemIds(directory, folderId);
    folderIds.forEach((folderId) => {
        const [path] = getFullPath(directory, folderId);
        folders.push({ itemId: folderId, path });
    });
    fileIds.forEach((fileId) => {
        const [path] = getFullPath(directory, fileId);
        files.push({ itemId: fileId, path });
    });

    return { folders, files };
}
