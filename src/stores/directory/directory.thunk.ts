import { createAsyncThunk } from "@reduxjs/toolkit";

import { DirectoryItem, File } from "./directory";
import { getFilesByIds, getRecursiveItemIds } from "./directory.utils";
import { DirectoryState, directorySelector } from "./directory.slice";
import { Project } from "../project";
import { filesDB, foldersDB, fireStoreDB } from "@/lib/storage";
import { getDefaultFile, getRefId } from "@/lib/file";

export type UploadFile = globalThis.File;

export const createFolderAsync = createAsyncThunk(
    "directory/createFolderAsync",
    async ({ project, data }: { project: Project; data: any }) => {
        return await foldersDB.create({
            ...data,
            projectId: project.projectId,
        });
    }
);

export const createFileAsync = createAsyncThunk(
    "directory/createFileAsync",
    async ({ project, data }: { project: Project; data: any }) => {
        const file = await filesDB.create({
            ...data,
            projectId: project.projectId,
        });
        const refId = getRefId(project, file);
        const uploadFile = getDefaultFile(file.name);
        const ref = await fireStoreDB.create({ refId, uploadFile });
        await filesDB.update(file.itemId, { url: await ref.getDownloadURL() });
        return file;
    }
);

export const uploadFileAsync = createAsyncThunk(
    "directory/uploadFileAsync",
    async ({
        project,
        uploadFile,
        data,
    }: {
        project: Project;
        uploadFile: UploadFile;
        data: any;
    }) => {
        const file = await filesDB.create({
            ...data,
            projectId: project.projectId,
        });
        const refId = getRefId(project, file);
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
        project: Project;
        itemId: string;
    },
    {
        state: { directory: DirectoryState };
    }
>(
    "directory/deleteDirectoryAsync",
    async ({ project, itemId }, { getState }) => {
        const directory = directorySelector.selectAll(getState().directory);
        const { folderIds, fileIds } = getRecursiveItemIds(directory, itemId);
        await foldersDB.delete(folderIds);
        await filesDB.delete(fileIds);

        const refIds = getFilesByIds(directory, fileIds).map((file) =>
            getRefId(project, file)
        );
        await fireStoreDB.delete(refIds);
        return folderIds.concat(fileIds);
    }
);

export const renameDirectoryItemAsync = createAsyncThunk(
    "directory/renameDirectoryItemAsync",
    async ({
        project,
        item,
        name,
    }: {
        project: Project;
        item: DirectoryItem;
        name: string;
    }) => {
        if (item.isFolder) {
            await foldersDB.update(item.itemId, { name });
        } else {
            /** @todo reset extension as well */
            await filesDB.update(item.itemId, { name });
            const refId = getRefId(project, item);
            await fireStoreDB.rename(refId, name);
        }
        return { id: item.itemId, changes: { name } };
    }
);

export const updateFileAsync = createAsyncThunk(
    "directory/updateFileAsync",
    async ({
        project,
        file,
        content,
    }: {
        project: Project;
        file: File;
        content: string;
    }) => {
        const refId = getRefId(project, file);
        const ref = await fireStoreDB.updateContent(refId, content);
        await filesDB.update(file.itemId, {
            content,
            url: await ref.getDownloadURL(),
        });
        return { id: file.itemId, changes: { content } };
    }
);

export const downloadDirectoryAsync = createAsyncThunk(
    "directory/downloadDirectoryAsync",
    async ({ project }: { project: Project }) => {
        const refId = getRefId(project);
        console.log(`[Thunk] Download ${refId}`);
        await fireStoreDB.download(refId);
    }
);
