import JSZip from "jszip";
import { ref, getBlob, listAll } from "firebase/storage";

import { storage } from "@/config/firebase";

export const addFilesToZip = async (refPath: string, zip: JSZip) => {
    const directoryContentsRef = ref(storage, refPath);
    const directoryContents = await listAll(directoryContentsRef);
    console.log(directoryContents);

    for (const file of directoryContents.items) {
        const fileRef = ref(storage, file.fullPath);
        const fileBlob = await getBlob(fileRef);
        zip.file(file.fullPath, fileBlob);
    }

    for (const folder of directoryContents.prefixes) {
        await addFilesToZip(folder.fullPath, zip);
    }
};
