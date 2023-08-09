import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getBlob } from "firebase/storage";
import { Reference, UploadTaskSnapshot } from "@firebase/storage-types";

import { storage } from "@/config/firebase";
import { UploadFile } from "@/stores/directory";
import { addFilesToZip } from "../zip";
import { IStorage } from "./proto";

type Payload = Record<string, any> & {
    srcPath: string;
    destPath?: string;
};

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

    private async execute(
        payload: Payload,
        action: (payload: Payload) => (file: Reference) => void
    ): Promise<void> {
        const { srcPath, destPath } = payload;
        console.log(`[execute] path: ${srcPath}`);
        const children = await storage.ref(srcPath).listAll();
        children.items.forEach(action(payload));
        children.prefixes.forEach(async (folder) => {
            await this.execute(
                {
                    ...payload,
                    srcPath: folder.fullPath,
                    destPath: destPath
                        ? `${destPath}/${folder.name}`
                        : undefined,
                },
                action
            );
        });
    }

    public async deleteAll(path: string): Promise<void> {
        await this.execute(
            { srcPath: path },
            () => async (file) => await file.delete()
        );
    }

    /**
     *
     * @param srcId the original `refId`
     * @param destId the destination `refId`
     * @returns the destination ref
     */
    private async cp(srcId: string, destId: string): Promise<void> {
        const [srcRef, destRef] = this.get([srcId, destId]);
        const metadata = (await srcRef.getMetadata()) || {
            contentType: "text",
        };
        const blob = await getBlob(srcRef);
        destRef.put(blob, metadata).on(
            "state_changed",
            taskSnapshot,
            (error) => console.log(error),
            async () => {
                const url = await destRef.getDownloadURL();
                console.log(`Upload completed: ${url}`);
            }
        );
    }

    public async copy(srcPath: string, destPath: string, isFolder: boolean) {
        if (isFolder) {
            await this.execute(
                { srcPath, destPath },
                ({ destPath }) =>
                    async (file) => {
                        console.log(
                            `[copy] ${file.fullPath} => ${destPath}/${file.name}`
                        );
                        await this.cp(
                            file.fullPath,
                            `${destPath}/${file.name}`
                        );
                    }
            );
        } else {
            await this.cp(srcPath, destPath);
        }
    }

    public async rename(
        srcPath: string,
        destPath: string,
        isFolder: boolean
    ): Promise<void> {
        if (isFolder) {
            await this.execute(
                { srcPath, destPath },
                ({ destPath }) =>
                    async (file) => {
                        console.log(
                            `[rename] ${file.fullPath} => ${destPath}/${file.name}`
                        );
                        await this.cp(
                            file.fullPath,
                            `${destPath}/${file.name}`
                        );
                        await file.delete();
                    }
            );
        } else {
            await this.cp(srcPath, destPath);
            await this.delete([srcPath]);
        }
    }

    public async delete(refIds: string[]): Promise<void> {
        for (let ref of this.get(refIds)) {
            await ref.delete();
        }
    }

    public async download(srcPath: string) {
        const zip = new JSZip();

        /** @TODO replace `addFilesToZip` with the scripts below */
        await addFilesToZip(srcPath, zip);
        /** @TODO this zip file will be empty, but reason unknown */
        // await this.execute({ srcPath, zip }, ({ zip }) => async (file) => {
        //     console.log(`[download] add to zip: ${file.fullPath}`);
        //     const fileBlob = await getBlob(file);
        //     zip.file(file.fullPath, fileBlob);
        // });

        const blob = await zip.generateAsync({ type: "blob" });
        const name = srcPath.split("/").pop();
        saveAs(blob, name);
    }
}
