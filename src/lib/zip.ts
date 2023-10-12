import JSZip from "jszip";
import { ref, getBlob, listAll } from "firebase/storage";

import { storage } from "@/config/firebase";

export const addFilesToZip = async (refPath: string, zip: JSZip) => {
    const children = await listAll(ref(storage, refPath));
    for (const file of children.items) {
        const fileBlob = await getBlob(file);
        zip.file(file.fullPath, fileBlob);
    }
    for (const folder of children.prefixes) {
        await addFilesToZip(folder.fullPath, zip);
    }
};
