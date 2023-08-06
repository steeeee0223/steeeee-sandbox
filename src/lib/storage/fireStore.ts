import { Reference, UploadTaskSnapshot } from "@firebase/storage-types";

import { storage } from "@/config/firebase";
import { UploadFile } from "@/stores/directory";
import { downloadFolderAsZip } from "../zip";
import { IStorage } from "./proto";

const taskSnapshot = (snapshot: UploadTaskSnapshot) => {
    const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );
    console.log(`uploading ${progress}%`);
};

export class FireStorage extends IStorage<Reference> {
    public collection = "firestore";
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
        return refIds.map((refId) => storage.ref(refId));
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

    public async rename(refId: string, name: string) {
        /** @todo Add file with new `refId` to FireStore  */
        /** @todo Delete original `refId` from FireStore */
        // await ref.delete();
    }

    public async delete(refIds: string[]): Promise<void> {
        for (let ref of this.get(refIds)) {
            await ref.delete();
        }
    }

    public async download(refId: string) {
        await downloadFolderAsZip(refId);
    }
}
