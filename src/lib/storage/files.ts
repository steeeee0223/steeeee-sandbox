import { db } from "@/config/firebase";
import { File } from "@/stores/directory";
import { IStorage } from "./proto";

export class FilesStorage extends IStorage<File> {
    public static __instance: FilesStorage;
    public collection = "files";

    private constructor() {
        super();
    }

    public static getStorage(): FilesStorage {
        return this.__instance ?? new FilesStorage();
    }

    public unpack(doc: any): File {
        const { parent, name, extension, content, path } = doc.data();
        return {
            itemId: doc.id,
            isFolder: false,
            name,
            parent,
            path,
            extension,
            content,
        } as File;
    }

    public async get({ projectId }: { projectId: string }): Promise<File[]> {
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
