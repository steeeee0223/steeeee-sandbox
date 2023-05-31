import {
    SelectedItem,
    DirectoryItem,
    File,
    Folder,
    DirectoryState,
} from "@/stores/directory";

const nothing: never = undefined as never;

export function toList(directoryEntity: DirectoryState): DirectoryItem[] {
    const { ids, entities } = directoryEntity;
    return ids.map((id) => entities[id] ?? nothing);
}

export function getAllFolders({ ids, entities }: DirectoryState): Folder[] {
    return ids
        .map((id) => entities[id] ?? nothing)
        .filter(({ isFolder }) => isFolder) as Folder[];
}

export function getAllFiles({ ids, entities }: DirectoryState): File[] {
    return ids
        .map((id) => entities[id] ?? nothing)
        .filter(({ isFolder }) => !isFolder) as File[];
}

export function getFile(
    directory: DirectoryItem[],
    itemId: string
): File | undefined {
    return (
        (directory.find(
            (item) => !item.isFolder && item.itemId === itemId
        ) as File) ?? undefined
    );
}

export function getChildren(
    directory: DirectoryItem[],
    itemId: string,
    sort: boolean = true
): DirectoryItem[] {
    const items = directory.filter((item) => item.parent === itemId);
    if (sort) {
        items.sort((item1, item2) => item1.title.localeCompare(item2.title));
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

export function getFullPath(
    directory: DirectoryItem[],
    itemId: string
): readonly [string[], string[]] {
    let name: string[] = [];
    let id: string[] = [];
    while (itemId !== "root") {
        const { parent, title } = getItem(directory, itemId);
        id.push(itemId);
        name.push(title);
        itemId = parent;
    }
    id = [...id, itemId].reverse();
    name = [...name, "root"].reverse();
    return [name, id] as const;
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
