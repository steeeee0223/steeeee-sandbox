import {
    SelectedItem,
    FolderSystemItem,
    Folder,
    File,
} from "@/components/project";
import { FileState } from "@/stores/files";

export class ProjectStorage {
    public currentItem!: SelectedItem;
    public currentEditors: string[] = [];
    public userFolders: Folder[] = [];
    public userFiles: File[] = [];

    constructor({
        currentEditors,
        currentItem,
        userFiles,
        userFolders,
    }: FileState) {
        this.currentEditors = currentEditors;
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

    public getParent(itemId: string): FolderSystemItem {
        const item = this.userItems.find((item) => itemId === item.itemId);
        return item ?? (undefined as never);
    }

    public getSelectedItem(itemId: string): SelectedItem {
        let { path, item }: SelectedItem = {
            item: { id: "", name: "", isFolder: {} as boolean },
            path: { id: [], name: [] },
        };
        let isFirst = true;

        while (itemId !== "root") {
            const { isFolder, parent, title } = this.getParent(itemId);
            if (isFirst) {
                item = { id: itemId, name: title, isFolder };
                isFirst = false;
            } else {
                path.id.push(itemId);
                path.name.push(title);
            }
            itemId = parent;
        }
        path = {
            id: [...path.id, itemId].reverse(),
            name: [...path.name, "root"].reverse(),
        };
        return { path, item };
    }

    public addEditor(itemId: string) {
        this.currentEditors.push(itemId);
    }

    public removeEditor(itemId: string) {
        this.currentEditors = this.currentEditors.filter((id) => id !== itemId);
    }
}
