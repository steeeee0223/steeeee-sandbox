import {
    StorageReference,
    UploadTaskSnapshot,
    getDownloadURL,
    getMetadata,
    ref as getRef,
    listAll,
    uploadBytesResumable,
    uploadString,
    deleteObject,
    getBlob,
    uploadBytes,
} from "firebase/storage";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { storage } from "@/config/firebase";
import { UploadFile } from "@/types";

const taskSnapshot = (snapshot: UploadTaskSnapshot) => {
    const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );
    console.log(`uploading ${progress}%`);
};

export const getRefs = (refIds: string[]): StorageReference[] =>
    refIds.map((refId) => getRef(storage, refId));

export const createRef = (
    refId: string,
    uploadFile: UploadFile
): StorageReference => {
    const ref = getRef(storage, refId);
    uploadBytesResumable(ref, uploadFile).on(
        "state_changed",
        taskSnapshot,
        (error) => console.log(error),
        async () => {
            const url = await getDownloadURL(ref);
            console.log(`Upload completed: ${url}`);
        }
    );
    return ref;
    // const result = await uploadBytes(ref, uploadFile);
    // return result.ref;
};

export const updateRefContent = async (
    refId: string,
    content: string
): Promise<StorageReference> => {
    const ref = getRef(storage, refId);
    const metadata = (await getMetadata(ref)) || {
        contentType: "text",
    };
    console.log(metadata);
    const result = await uploadString(ref, content, "raw", metadata);
    return result.ref;
};

type Payload = Record<string, unknown> & {
    srcPath: string;
    destPath?: string;
};

const $execute = async (
    payload: Payload,
    action: (payload: Payload) => (file: StorageReference) => void
) => {
    const { srcPath, destPath } = payload;
    console.log(`[execute] path: ${srcPath}`);

    const children = await listAll(getRef(storage, srcPath));
    children.items.forEach(action(payload));
    children.prefixes.forEach(async (folder) => {
        await $execute(
            {
                ...payload,
                srcPath: folder.fullPath,
                destPath: destPath ? `${destPath}/${folder.name}` : undefined,
            },
            action
        );
    });
};

export const deleteRefs = async (paths: string[]) => {
    for await (const srcPath of paths) {
        await $execute({ srcPath }, () => deleteObject);
    }
};

const $copy = async (srcId: string, destId: string) => {
    const [srcRef, destRef] = getRefs([srcId, destId]);
    const metadata = (await getMetadata(srcRef)) || {
        contentType: "text",
    };
    const blob = await getBlob(srcRef);
    await uploadBytes(destRef, blob, metadata);
};

export const copyRef = async (
    srcPath: string,
    destPath: string,
    isFolder: boolean
) => {
    isFolder
        ? await $execute(
              { srcPath, destPath },
              ({ destPath }) =>
                  async (file) => {
                      console.log(
                          `[copy] ${file.fullPath} => ${destPath}/${file.name}`
                      );
                      await $copy(file.fullPath, `${destPath}/${file.name}`);
                  }
          )
        : await $copy(srcPath, destPath);
};

export const renameRef = async (
    srcPath: string,
    destPath: string,
    isFolder: boolean
) => {
    if (isFolder) {
        await $execute(
            { srcPath, destPath },
            ({ destPath }) =>
                async (file) => {
                    console.log(
                        `[rename] ${file.fullPath} => ${destPath}/${file.name}`
                    );
                    await $copy(file.fullPath, `${destPath}/${file.name}`);
                    await deleteObject(file);
                }
        );
    } else {
        await $copy(srcPath, destPath);
        await deleteRefs([srcPath]);
    }
};

export const downloadRef = async (srcPath: string) => {
    const zip = new JSZip();

    await $execute({ srcPath }, () => async (file) => {
        console.log(`[download] add to zip: ${file.fullPath}`);
        const fileBlob = await getBlob(file);
        zip.file(file.fullPath, fileBlob);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const name = srcPath.split("/").pop();
    saveAs(blob, name);
};

export default {
    getAll: getRefs,
    create: createRef,
    updateContent: updateRefContent,
    delete: deleteRefs,
    copy: copyRef,
    rename: renameRef,
    download: downloadRef,
};
