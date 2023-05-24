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

    public getChildren(itemId: string): FolderSystemItem[] {
        return this.userItems
            .filter((item) => item.parent === itemId)
            .sort((item1, item2) => item1.title.localeCompare(item2.title));
    }

    public getItem(itemId: string): FolderSystemItem {
        const item = this.userItems.find((item) => itemId === item.itemId);
        return item ?? (undefined as never);
    }

    public getFullPath(itemId: string) {
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
        let item = { isFolder: true, name: "", id: "" };
        if (itemId !== "root") {
            const { isFolder } = this.getItem(itemId);
            item = {
                isFolder,
                name: name.pop() ?? (undefined as never),
                id: id.pop() ?? (undefined as never),
            };
        }
        return { item, path: { name, id } };
    }
}
