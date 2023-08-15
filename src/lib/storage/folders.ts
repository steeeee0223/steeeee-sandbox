import { db } from "@/config/firebase";
import { Folder, getChildren } from "@/stores/directory";
import { IStorage } from "./proto";

export class FoldersStorage extends IStorage<Folder> {
    public static __instance: FoldersStorage;
    public collection = "folders";

    private constructor() {
        super();
    }

    public static getStorage(): FoldersStorage {
        return this.__instance ?? new FoldersStorage();
    }

    public unpack(doc: any): Folder {
        const { projectId, parent, name, path } = doc.data();
        return {
            projectId,
            parent,
            name,
            path,
            itemId: doc.id,
            isFolder: true,
        } as Folder;
    }

    public async get({ projectId }: { projectId: string }): Promise<Folder[]> {
        try {
            const res = await db
                .collection(this.collection)
                .where("projectId", "==", projectId)
                .get();
            return res.docs.map(this.unpack);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    /**
     * @param projectId id of this project
     * @param path an array of folder names, started from `root`
     * @returns `exist` if this path exists,
     *  and `folderId` stands for the last folder of the `path`
     */
    public async isPathCreated({
        projectId,
        path,
    }: {
        projectId: string;
        path: string[];
    }): Promise<{ exist: boolean; folderId?: string; parent?: string }> {
        const folders = await this.get({ projectId });
        let currLayer = { id: "root", name: "root" };
        for (const folderName of path.slice(1)) {
            const children = getChildren(folders, currLayer.id, false);
            const res = children.find(({ name }) => name === folderName);
            if (res) {
                currLayer = { id: res.itemId, name: res.name };
            } else {
                return { exist: false, parent: currLayer.id };
            }
        }
        return { exist: true, folderId: currLayer.id };
    }
}
