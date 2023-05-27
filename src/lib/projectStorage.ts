import {
    SelectedItem,
    FolderSystemItem,
    Folder,
    File,
} from "@/components/project";
import { FileState } from "@/stores/files";

export class ProjectStorage {
    public currentItem!: SelectedItem;
    public userFolders: Folder[] = [];
    public userFiles: File[] = [];

    constructor({ currentItem, userFiles, userFolders }: FileState) {
        this.currentItem = currentItem;
        this.userFiles = userFiles;
        this.userFolders = userFolders;
    }

    public get userItems(): FolderSystemItem[] {
        return (this.userFiles as FolderSystemItem[]).concat(this.userFolders);
    }

    public getFile(itemId: string): File | undefined {
        return this.userFiles.find((file) => file.itemId === itemId);
    }

    public getChildren(
        itemId: string,
        sort: boolean = true
    ): FolderSystemItem[] {
        const items = this.userItems.filter((item) => item.parent === itemId);
        if (sort) {
            items.sort((item1, item2) =>
                item1.title.localeCompare(item2.title)
            );
        }
        return items;
    }

    public getItem(itemId: string): FolderSystemItem {
        const item = this.userItems.find((item) => itemId === item.itemId);
        return item ?? (undefined as never);
    }

    public getFullPath(itemId: string): readonly [string[], string[]] {
        let name: string[] = [];
        let id: string[] = [];
        while (itemId !== "root") {
            const { parent, title } = this.getItem(itemId);
            id.push(itemId);
            name.push(title);
            itemId = parent;
        }
        id = [...id, itemId].reverse();
        name = [...name, "root"].reverse();
        return [name, id] as const;
    }

    public getSelectedItem(itemId: string): SelectedItem {
        const [name, id] = this.getFullPath(itemId);
        let isFolder = true;
        if (itemId !== "root") {
            isFolder = this.getItem(itemId).isFolder;
        }
        const item = {
            isFolder,
            name: name.pop() ?? (undefined as never),
            id: id.pop() ?? (undefined as never),
        };
        return { item, path: { name, id } };
    }

    /**
     *
     * @param itemId
     * @returns all items under this directory/file `itemId`, including `itemId` itself
     */
    public getRecursiveItemIds(itemId: string): {
        folders: string[];
        files: string[];
    } {
        if (itemId === "root")
            return {
                folders: this.userFolders.map(({ itemId }) => itemId),
                files: this.userFiles.map(({ itemId }) => itemId),
            };

        const folders: string[] = [];
        const files: string[] = [];
        const { isFolder } = this.getItem(itemId);
        if (isFolder) {
            folders.push(itemId);
            const getItems = (itemId: string) => {
                this.getChildren(itemId, false).forEach((child) => {
                    if (child.isFolder) {
                        folders.push(child.itemId);
                        getItems(child.itemId);
                    } else {
                        files.push(child.itemId);
                    }
                });
            };
            getItems(itemId);
        } else {
            files.push(itemId);
        }
        return { folders, files };
    }
}
