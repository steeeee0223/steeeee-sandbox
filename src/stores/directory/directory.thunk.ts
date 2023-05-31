import { createAsyncThunk } from "@reduxjs/toolkit";

import { FilesStorage, FoldersStorage } from "@/lib/storage";
import { accordion as sampleFolders, children as sampleFiles } from "@/data";
import { DirectoryItem } from "./directory";
import { getRecursiveItemIds, toList } from "./directory.utils";
import { DirectoryState } from "./directory.slice";

const foldersDB = FoldersStorage.getStorage();
const filesDB = FilesStorage.getStorage();

export const createFolderAsync = createAsyncThunk(
    "directory/createFolderAsync",
    async (data: any) => {
        return await foldersDB.create(data);
    }
);

export const createFileAsync = createAsyncThunk(
    "directory/createFileAsync",
    async (data: any) => {
        return await filesDB.create(data);
    }
);

export const getDirectoryAsync = createAsyncThunk(
    "directory/getDirectoryAsync",
    async (userId: string) => {
        const directoryItems: DirectoryItem[] = [];
        const folders = await foldersDB.get(userId);
        const files = await filesDB.get(userId);
        return directoryItems.concat(
            folders,
            sampleFolders,
            files,
            sampleFiles
        );
    }
);

export const deleteDirectoryAsync = createAsyncThunk<
    string[],
    string,
    {
        state: { directory: DirectoryState };
    }
>("directory/deleteDirectoryAsync", async (itemId: string, { getState }) => {
    const directory = toList(getState().directory);
    const { folderIds, fileIds } = getRecursiveItemIds(directory, itemId);
    await foldersDB.delete(folderIds);
    await filesDB.delete(fileIds);
    return folderIds.concat(fileIds);
});
