import { getChildren } from "@/stores/directory";
import { Folder } from "@/types";
import {
    BaseDBModel,
    UnpackFunction,
    create,
    del,
    get,
    update,
} from "./fireStore";

export interface FolderModel extends BaseDBModel {
    projectId: string;
    name: string;
    path: string[];
    parent: string;
}

const $foldersCollection = "folders";
const unpackFolder: UnpackFunction<Folder> = (doc) => {
    const { parent, name, path } = doc.data()!;
    const folder: Folder = {
        parent,
        name,
        path,
        itemId: doc.id,
        isFolder: true,
    };
    return folder;
};

export const getFolders = async (projectId: string) =>
    await get<Folder, FolderModel>($foldersCollection, unpackFolder, {
        projectId,
    });

export const createFolder = async (data: Partial<FolderModel>) =>
    await create<Folder, FolderModel>($foldersCollection, data, unpackFolder);

export const updateFolder = async (id: string, data: Partial<FolderModel>) =>
    await update<Folder, FolderModel>(
        $foldersCollection,
        id,
        data,
        unpackFolder
    );

export const deleteFolders = async (ids: string[]) =>
    await del($foldersCollection, ids);

/**
 * @param projectId id of this project
 * @param path an array of folder names, started from `root`
 * @returns `exist` if this path exists,
 *  and `folderId` stands for the last folder of the `path`
 */
export const isPathCreated = async (
    projectId: string,
    path: string[]
): Promise<{ exist: boolean; folderId?: string; parent?: string }> => {
    const folders = await getFolders(projectId);
    let currLayer = { id: "root", name: "root" };
    for (const folderName of path.slice(1)) {
        const children = getChildren(folders, currLayer.id, false);
        const res = children.find(({ name }) => name === folderName);
        if (res) {
            currLayer = { id: res.itemId, name: res.name };
        } else {
            return { exist: false, parent: currLayer.id };
        }
    }
    return { exist: true, folderId: currLayer.id };
};

export default {
    getAll: getFolders,
    create: createFolder,
    update: updateFolder,
    delete: deleteFolders,
    isPathCreated,
};
