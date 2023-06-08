import { UploadFile } from "@/stores/directory";

export function getExtension(filename: string): string {
    if (filename.startsWith(".")) return "";
    const split = filename.split(".");
    if (split.length === 0) {
        return "";
    }
    return split.at(split.length - 1) ?? "";
}

export function getContent(file: UploadFile): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () =>
            resolve(reader.result !== null ? reader.result.toString() : "");
        reader.readAsText(file);
        reader.onerror = () => {
            console.log(`Error while reading file: ${reader.error}`);
        };
    });
}
