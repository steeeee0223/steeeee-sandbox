import { db, storage } from "@/config/firebase";
import { File, Folder, UploadFile } from "@/stores/directory";

abstract class IStorage<T> {
    public collection!: string;

    public abstract unpack(doc: any): T;

    public async get(userId: string, projectId: string): Promise<T[]> {
        try {
            const res = await db
                .collection(this.collection)
                // .where("userId", "==", userId)
                .where("projectId", "==", projectId)
                .get();
            const items: T[] = await res.docs.map((doc) => {
                return this.unpack(doc);
            });
            return items;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public async create(projectId: string, data: any): Promise<T> {
        try {
            const insertData = { ...data, projectId };
            const res = await db.collection(this.collection).add(insertData);
            const doc = await res.get();
            return this.unpack(doc);
        } catch (error) {
            throw new Error(
                `[${this.collection}] Error occurred while adding the doc into database`
            );
        }
    }

    public async update(itemId: string, data: any): Promise<T> {
        try {
            const updateData = { ...data, updatedAt: new Date() };
            await db.collection(this.collection).doc(itemId).update(updateData);
            const doc = await db.collection(this.collection).doc(itemId).get();
            return this.unpack(doc);
        } catch (error) {
            throw new Error(
                `[${this.collection}] Error occurred while updating the doc`
            );
        }
    }

    public async delete(ids: string[]) {
        for (const id of ids) {
            try {
                await db.collection(this.collection).doc(id).delete();
            } catch (error) {
                console.log(error);
            }
        }
    }
}

export class FilesStorage extends IStorage<File> {
    public static __instance: FilesStorage;
    public collection = "files";

    private constructor() {
        super();
    }

    public static getStorage(): FilesStorage {
        return this.__instance ?? new FilesStorage();
    }

    public unpack<File>(doc: any): File {
        const { parent, name, extension, content } = doc.data();
        return {
            itemId: doc.id,
            isFolder: false,
            name,
            parent,
            extension,
            content,
        } as File;
    }

    public async upload(
        projectId: string,
        data: any,
        uploadFile: UploadFile
    ): Promise<File> {
        const file = await this.create(projectId, data);
        const ref = storage.ref(
            `${this.collection}/${projectId}/${file.itemId}`
        );

        ref.put(uploadFile).on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log("uploading " + progress + "%");
            },
            (error) => {
                console.log(error);
            },
            async () => {
                const url = await ref.getDownloadURL();
                await this.update(file.itemId, { url });
            }
        );
        return file;
    }

    public async doDelete(projectId: string, fileIds: string[]) {
        fileIds.forEach(async (fileId) => {
            const ref = storage.ref(
                `${this.collection}/${projectId}/${fileId}`
            );
            await ref.delete();
        });
        await this.delete(fileIds);
    }
}

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
        const { projectId, parent, name } = doc.data();
        return {
            projectId,
            parent,
            name,
            itemId: doc.id,
            isFolder: true,
        } as Folder;
    }
}
