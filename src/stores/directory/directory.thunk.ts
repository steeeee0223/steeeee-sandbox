import { Update, createAsyncThunk } from "@reduxjs/toolkit";
import { getDownloadURL } from "firebase/storage";

import { getFilesByIds, getRecursiveItemIds } from "./directory.utils";
import { DirectoryState, directorySelector } from "./directory.slice";
import { filesDB, foldersDB, storageDB } from "@/lib/storage";
import { getDefaultFile, getExtension, getRefId } from "@/lib/file";
import { DirectoryItem, File, Folder, Project, UploadFile } from "@/types";

export const createFolderAsync = createAsyncThunk<
    Folder,
    { project: Project; data: any }
>("directory/createFolderAsync", async ({ project, data }) => {
    return await foldersDB.create({
        ...data,
        projectId: project.projectId,
    });
});

export const createFileAsync = createAsyncThunk<
    File,
    { project: Project; data: any }
>("directory/createFileAsync", async ({ project, data }) => {
    const file = await filesDB.create({
        ...data,
        projectId: project.projectId,
    });

    console.log(`[Thunk] created file: ${file.name} => ${file.itemId}`);
    const refId = getRefId(project, file);
    const uploadFile = getDefaultFile(file.name, data.content);
    const ref = await storageDB.create(refId, uploadFile);
    await filesDB.update(file.itemId, { url: await getDownloadURL(ref) });
    return file;
});

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
        const ref = await storageDB.create(refId, uploadFile);
        await filesDB.update(file.itemId, { url: await getDownloadURL(ref) });
        return file;
    }
);

export const getDirectoryAsync = createAsyncThunk(
    "directory/getDirectoryAsync",
    async ({ userId, projectId }: { userId: string; projectId: string }) => {
        const directoryItems: DirectoryItem[] = [];
        const folders = await foldersDB.getAll(projectId);
        const files = await filesDB.getAll(projectId);
        return directoryItems.concat(folders, files);
    }
);

export const deleteDirectoryAsync = createAsyncThunk<
    string[],
    { project: Project; itemId: string },
    { state: { directory: DirectoryState } }
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
        await storageDB.delete(refIds);
        return folderIds.concat(fileIds);
    }
);

export const renameDirectoryItemAsync = createAsyncThunk<
    Update<DirectoryItem>[],
    { project: Project; item: DirectoryItem; name: string },
    { state: { directory: DirectoryState } }
>(
    "directory/renameDirectoryItemAsync",
    async ({ project, item, name }, { getState }) => {
        let updates = new Array<Update<DirectoryItem>>();
        let newItem = {} as DirectoryItem;
        if (item.isFolder) {
            newItem = await foldersDB.update(item.itemId, { name });

            /**
             * @todo update all other folders/files' `path` beyond this folder in Firebase
             * although current breadcrumbs are still correct
             * since current breadcrumbs use `getFullPath` instead of the `path` in Firebase
             */
        } else {
            /** @todo reset extension in Firebase */
            newItem = await filesDB.update(item.itemId, { name });
        }

        /** rename folders/files in FireStore */
        const srcPath = getRefId(project, item);
        const destPath = getRefId(project, newItem);
        await storageDB.rename(srcPath, destPath, item.isFolder);
        updates.push({ id: item.itemId, changes: { name } });
        return updates;
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
        const ref = await storageDB.updateContent(refId, content);
        await filesDB.update(file.itemId, {
            content,
            url: await getDownloadURL(ref),
        });
        return { id: file.itemId, changes: { content } };
    }
);

export const downloadDirectoryAsync = createAsyncThunk(
    "directory/downloadDirectoryAsync",
    async ({ project }: { project: Project }) => {
        const refId = getRefId(project);
        console.log(`[Thunk] Download ${refId}`);
        await storageDB.download(refId);
    }
);

export const createParentFolders = createAsyncThunk<
    void,
    { project: Project; path: string[] }
>("directory/createParentFolders", async ({ project, path }, { dispatch }) => {
    for await (const [i, folderName] of path.entries()) {
        const { exist, folderId, parent } = await foldersDB.isPathCreated(
            project.projectId,
            path.slice(0, i + 1)
        );
        if (exist) {
            console.log(`[Thunk] Folder exists: ${folderName} => ${folderId}`);
        } else {
            console.log(
                `[Thunk] Folder not exist under ${parent}: ${folderName}`
            );
            dispatch(
                createFolderAsync({
                    project,
                    data: {
                        name: folderName,
                        path: path.slice(0, i),
                        parent,
                    },
                })
            );
        }
    }
});

export const configureTemplateAsync = createAsyncThunk<
    void,
    { project: Project; files: Record<string, { code: string }> },
    { state: { directory: DirectoryState } }
>(
    "directory/configureTemplateAsync",
    async ({ project, files }, { dispatch }) => {
        for await (const [file, { code }] of Object.entries(files)) {
            console.log(`[Thunk] Configure ${file}`);
            const fullPath = `root${file}`.split("/");
            const filePath = fullPath.slice(0, -1);
            const fileName = fullPath.at(-1)!;

            /** create folder before create files */
            await dispatch(createParentFolders({ project, path: filePath }));
            const { folderId } = await foldersDB.isPathCreated(
                project.projectId,
                filePath
            );
            const data = {
                name: fileName,
                path: filePath,
                parent: folderId,
                content: code,
                extension: getExtension(fileName),
            };
            await dispatch(createFileAsync({ project, data }));
        }
    }
);
