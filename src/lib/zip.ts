import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ref, getBlob, listAll } from "firebase/storage";

import { storage } from "@/config/firebase";

const addFilesToZip = async (refPath: string, zip: JSZip) => {
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

export const downloadFolderAsZip = async (refPath: string) => {
    const zip = new JSZip();
    await addFilesToZip(refPath, zip);

    const blob = await zip.generateAsync({ type: "blob" });
    const name = refPath.split("/").pop();
    saveAs(blob, name);
};
