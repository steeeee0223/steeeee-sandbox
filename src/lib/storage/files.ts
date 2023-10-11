import { File } from "@/types";
import {
    BaseDBModel,
    UnpackFunction,
    create,
    del,
    get,
    update,
} from "./fireStore";

export interface FileModel extends BaseDBModel {
    projectId: string;
    name: string;
    path: string[];
    parent: string;
    extension: string;
    content: string;
    url: string;
}

const $filesCollection = "files";
const unpackFile: UnpackFunction<File> = (doc) => {
    const { parent, name, path, extension, content } = doc.data()!;
    const file: File = {
        parent,
        name,
        path,
        itemId: doc.id,
        isFolder: false,
        extension,
        content,
    };
    return file;
};

export const getFiles = async (projectId: string) =>
    await get<File, FileModel>($filesCollection, unpackFile, { projectId });

export const createFile = async (data: Partial<FileModel>) =>
    await create<File, FileModel>($filesCollection, data, unpackFile);

export const updateFile = async (id: string, data: Partial<FileModel>) =>
    await update<File, FileModel>($filesCollection, id, data, unpackFile);

export const deleteFiles = async (ids: string[]) =>
    await del($filesCollection, ids);

export default {
    getAll: getFiles,
    create: createFile,
    update: updateFile,
    delete: deleteFiles,
};
