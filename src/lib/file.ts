import type { DirectoryItem, Project, UploadFile } from "@/types";

/**
 * File extension -> content type
 * @doc https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
const typeMapping: Record<string, string> = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    jsx: "text/javascript",
    ts: "text/javascript",
    tsx: "text/javascript",
    rb: "text/x-ruby-script",
    py: "text/x-python-script",
    c: "text/x-c",
    cpp: "text/x-c",
    java: "text/x-java-source",
    json: "application/json",
};

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

export function getDefaultFile(filename: string, content?: string): UploadFile {
    const extension = getExtension(filename);
    const options: FilePropertyBag = {
        type: typeMapping[extension] || "text/plain",
    };
    const blobParts = content ? [content] : [];
    return new File(blobParts, filename, options);
}

/**
 * @summary normalize the path such that it starts with `/`
 * @argument path an array of item names started from `root`
 *
 * @example ['root', 'components', 'Button.tsx']
 * -> ['components', 'Button.tsx']
 * -> `/components/Button.tsx`
 */
export function normalizePath(path: string[]): string {
    return `/${path.slice(1).join("/")}`;
}

/**
 * @summary Generate the `refId` from the `item` of the `project` in FireStore
 * @example `<project.name>-<project.id><normalizedPath>/<item.name>`
 */
export function getRefId(project: Project, item?: DirectoryItem): string {
    const prefix = `${project.name}-${project.projectId}`;
    const refId = item
        ? `${prefix}${normalizePath([...item.path, item.name])}`
        : prefix;
    console.log(`[Lib] got ref id: ${refId}`);
    return refId;
}
