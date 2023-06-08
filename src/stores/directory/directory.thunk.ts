import { Update, createAsyncThunk } from "@reduxjs/toolkit";

import { storage } from "@/config/firebase";
import { FilesStorage, FoldersStorage } from "@/lib/storage";
import { accordion as sampleFolders, children as sampleFiles } from "@/data";
import { DirectoryItem } from "./directory";
import { getRecursiveItemIds, toList } from "./directory.utils";
import { DirectoryState } from "./directory.slice";

const foldersDB = FoldersStorage.getStorage();
const filesDB = FilesStorage.getStorage();

export type UploadFile = File;

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

export const uploadFileAsync = createAsyncThunk(
    "directory/uploadFile",
    async ({ file, data }: { file: UploadFile; data: any }) => {
        return await filesDB.upload(data, file);
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
    {
        projectId: string;
        itemId: string;
    },
    {
        state: { directory: DirectoryState };
    }
>(
    "directory/deleteDirectoryAsync",
    async ({ projectId, itemId }, { getState }) => {
        const directory = toList(getState().directory);
        const { folderIds, fileIds } = getRecursiveItemIds(directory, itemId);
        await foldersDB.delete(folderIds);
        await filesDB.doDelete(projectId, fileIds);
        return folderIds.concat(fileIds);
    }
);

export const renameDirectoryItemAsync = createAsyncThunk(
    "directory/renameDirectoryItemAsync",
    async ({
        isFolder,
        itemId,
        name,
    }: {
        isFolder: boolean;
        itemId: string;
        name: string;
    }) => {
        if (isFolder) {
            await foldersDB.update(itemId, { name });
        } else {
            // TODO reset extension as well
            await filesDB.update(itemId, { name });
        }
        return {
            id: itemId,
            changes: { title: name },
        };
    }
);
