import { Timestamp } from "firebase/firestore";
import { Reference } from "@firebase/storage-types";

import { db, storage } from "@/config/firebase";
import { File, Folder, UploadFile } from "@/stores/directory";
import { Project } from "@/stores/project";

abstract class IStorage<T> {
    public collection!: string;

    public abstract unpack(doc: any): T;

    public abstract get(params: any): Promise<T[]> | T[];

    public async create(data: any): Promise<T> {
        try {
            const res = await db.collection(this.collection).add(data);
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

class ProjectStorage extends IStorage<Project> {
    public static __instance: ProjectStorage;
    public collection = "projects";

    private constructor() {
        super();
    }

    public static getStorage(): ProjectStorage {
        return this.__instance ?? new ProjectStorage();
    }

    public unpack(doc: any): Project {
        const {
            name,
            template,
            tags,
            createdBy,
            lastModifiedAt: { seconds, nanoseconds },
        } = doc.data();
        return {
            projectId: doc.id,
            name,
            template,
            tags,
            createdBy,
            lastModifiedAt: new Timestamp(seconds, nanoseconds).toDate(),
        };
    }

    public async get(userId: string): Promise<Project[]> {
        try {
            const res = await db
                .collection(this.collection)
                .where("createdBy.uid", "==", userId)
                .get();
            return res.docs.map(this.unpack);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

class FilesStorage extends IStorage<File> {
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

    public async get({
        userId,
        projectId,
    }: {
        userId: string;
        projectId: string;
    }): Promise<File[]> {
        try {
            const res = await db
                .collection(this.collection)
                // .where("userId", "==", userId)
                .where("projectId", "==", projectId)
                .get();
            return res.docs.map(this.unpack);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

class FoldersStorage extends IStorage<Folder> {
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

    public async get({
        userId,
        projectId,
    }: {
        userId: string;
        projectId: string;
    }): Promise<Folder[]> {
        try {
            const res = await db
                .collection(this.collection)
                // .where("userId", "==", userId)
                .where("projectId", "==", projectId)
                .get();
            return res.docs.map(this.unpack);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

const taskSnapshot = (snapshot: any) => {
    const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );
    console.log(`uploading ${progress}%`);
};
class FireStorage extends IStorage<Reference> {
    public collection = "files";
    public static __instance: FireStorage;

    private constructor() {
        super();
    }

    public static getStorage(): FireStorage {
        return this.__instance ?? new FireStorage();
    }

    public unpack(doc: any): Reference {
        throw new Error("Method not implemented.");
    }

    /**
     *
     * @param refIds list of refId: `${projectId}/${fileId}`
     * @returns
     */
    public get(refIds: string[]): Reference[] {
        return refIds.map((refId) =>
            storage.ref(`${this.collection}/${refId}`)
        );
    }

    public async create({
        refId,
        uploadFile,
    }: {
        refId: string;
        uploadFile: UploadFile;
    }): Promise<Reference> {
        const [ref] = this.get([refId]);
        ref.put(uploadFile).on(
            "state_changed",
            taskSnapshot,
            (error) => console.log(error),
            async () => {
                const url = await ref.getDownloadURL();
                console.log(`Upload completed: ${url}`);
            }
        );
        return ref;
    }

    public async updateContent(
        refId: string,
        content: string
    ): Promise<Reference> {
        const [ref] = this.get([refId]);
        const metadata = (await ref.getMetadata()) || {
            contentType: "text",
        };
        console.log(metadata);
        ref.putString(content, "raw", metadata).on(
            "state_changed",
            taskSnapshot,
            (error) => console.log(error),
            async () => {
                const url = await ref.getDownloadURL();
                console.log(`Content update complete!`);
                console.log(`New url: ${url}`);
            }
        );
        return ref;
    }

    public async delete(refIds: string[]): Promise<void> {
        for (let ref of this.get(refIds)) {
            await ref.delete();
        }
    }
}

export const projectsDB = ProjectStorage.getStorage();
export const foldersDB = FoldersStorage.getStorage();
export const filesDB = FilesStorage.getStorage();
export const fireStoreDB = FireStorage.getStorage();
