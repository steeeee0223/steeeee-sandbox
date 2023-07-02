import { createAsyncThunk } from "@reduxjs/toolkit";

import { DirectoryItem } from "./directory";
import { getRecursiveItemIds } from "./directory.utils";
import { DirectoryState, directorySelector } from "./directory.slice";
import { filesDB, foldersDB, fireStoreDB } from "@/lib/storage";

export type UploadFile = File;

export const createFolderAsync = createAsyncThunk(
    "directory/createFolderAsync",
    async ({ projectId, data }: { projectId: string; data: any }) => {
        return await foldersDB.create({ ...data, projectId });
    }
);

export const createFileAsync = createAsyncThunk(
    "directory/createFileAsync",
    async ({ projectId, data }: { projectId: string; data: any }) => {
        return await filesDB.create({ ...data, projectId });
    }
);

export const uploadFileAsync = createAsyncThunk(
    "directory/uploadFileAsync",
    async ({
        projectId,
        uploadFile,
        data,
    }: {
        projectId: string;
        uploadFile: UploadFile;
        data: any;
    }) => {
        const file = await filesDB.create({ ...data, projectId });
        const refId = `${projectId}/${file.itemId}`;
        const ref = await fireStoreDB.create({ refId, uploadFile });
        await filesDB.update(file.itemId, { url: await ref.getDownloadURL() });
        return file;
    }
);

export const getDirectoryAsync = createAsyncThunk(
    "directory/getDirectoryAsync",
    async (payload: { userId: string; projectId: string }) => {
        const directoryItems: DirectoryItem[] = [];
        const folders = await foldersDB.get(payload);
        const files = await filesDB.get(payload);
        return directoryItems.concat(folders, files);
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
        const directory = directorySelector.selectAll(getState().directory);
        const { folderIds, fileIds } = getRecursiveItemIds(directory, itemId);
        await foldersDB.delete(folderIds);
        await filesDB.delete(fileIds);

        const refIds = fileIds.map((fileId) => `${projectId}/${fileId}`);
        await fireStoreDB.delete(refIds);
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
        return { id: itemId, changes: { name } };
    }
);

export const updateFileAsync = createAsyncThunk(
    "directory/updateFileAsync",
    async ({
        projectId,
        itemId,
        content,
    }: {
        projectId: string;
        itemId: string;
        content: string;
    }) => {
        const refId = `${projectId}/${itemId}`;
        const ref = await fireStoreDB.updateContent(refId, content);
        await filesDB.update(itemId, {
            content,
            url: await ref.getDownloadURL(),
        });
        return { id: itemId, changes: { content } };
    }
);
