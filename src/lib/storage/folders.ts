import { db } from "@/config/firebase";
import { Folder } from "@/stores/directory";
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
}
