import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "@/config/firebase";
import { FileActionTypes } from "@/stores/files/file.types";
import { File, Folder, SelectedItem } from "@/components/project";
import { accordion as sampleFolders, children as sampleFiles } from "@/data";
import { AppDispatch } from "@/hooks";

const __setLoading = (
    payload: boolean
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.SET_LOADING,
    payload,
});
const __setCreation = (
    payload: string | null
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.SET_CREATION,
    payload,
});
const __setFileAction = (
    payload: string | null
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.SET_ACTION,
    payload,
});
const __createFolder = (
    payload: Folder
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.CREATE_FOLDER,
    payload,
});
const __getFolders = (
    payload: Folder[]
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.GET_FOLDERS,
    payload,
});
const __deleteFolders = (
    payload: string[]
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.DELETE_FOLDERS,
    payload,
});
const __createFile = (
    payload: File
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.CREATE_FILE,
    payload,
});
const __getFiles = (
    payload: File[]
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.GET_FILES,
    payload,
});
const __deleteFiles = (
    payload: string[]
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.DELETE_FILES,
    payload,
});
const __selectItem = (
    payload: SelectedItem
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.SELECT_ITEM,
    payload,
});
const __setEditor = (
    payload: string | null
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.SET_EDITOR,
    payload,
});
const __openEditor = (
    payload: string
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.OPEN_EDITOR,
    payload,
});
const __closeEditors = (
    payload: string[]
): PayloadAction<typeof payload, FileActionTypes> => ({
    type: FileActionTypes.CLOSE_EDITORS,
    payload,
});

/**
 * Action Creators
 */

export const setCreation =
    (creationType: string | null) => (dispatch: AppDispatch) => {
        dispatch(__setCreation(creationType));
    };

export const setFileAction =
    (actionType: string | null) => (dispatch: AppDispatch) => {
        dispatch(__setFileAction(actionType));
    };

export const createFolder = (data: any) => async (dispatch: AppDispatch) => {
    const res = await db.collection("folders").add(data);
    const doc = await res.get();
    const { name, parent } = doc.data() ?? (undefined as never);
    dispatch(
        __createFolder({
            itemId: doc.id,
            title: name,
            isFolder: true,
            parent,
        })
    );
};

export const getFolders = (userId: string) => async (dispatch: AppDispatch) => {
    const res = await db
        .collection("folders")
        // .where("userId", "==", userId)
        .get();
    const items: Folder[] = await res.docs.map((doc) => {
        const { parent, name } = doc.data();
        return {
            parent,
            itemId: doc.id,
            title: name,
            isFolder: true,
        };
    });

    /** with default folders */
    sampleFolders.push(...items);

    dispatch(__getFolders(sampleFolders));
};

export const deleteFolders =
    (folderIds: string[]) => (dispatch: AppDispatch) => {
        folderIds.forEach(async (folderId) => {
            try {
                await db
                    .collection("folders")
                    // .where("userId", "==", userId)
                    .doc(folderId)
                    .delete();
            } catch (error) {
                console.log(error);
            }
        });
        dispatch(__deleteFolders(folderIds));
    };

export const createFile = (data: any) => async (dispatch: AppDispatch) => {
    const res = await db.collection("files").add(data);
    const doc = await res.get();
    const { name, parent, extension, content } =
        doc.data() ?? (undefined as never);
    dispatch(
        __createFile({
            itemId: doc.id,
            title: name,
            isFolder: false,
            parent,
            extension,
            content,
        })
    );
    dispatch(__openEditor(doc.id));
};

export const getFiles = (userId: string) => async (dispatch: AppDispatch) => {
    const res = await db
        .collection("files")
        // .where("userId", "==", userId)
        .get();
    const items: File[] = await res.docs.map((doc) => {
        const { parent, name, extension, content } = doc.data();
        return {
            itemId: doc.id,
            isFolder: false,
            title: name,
            parent,
            extension,
            content,
        };
    });

    /** with default files */
    sampleFiles.push(...items);

    dispatch(__getFiles(sampleFiles));
};

export const deleteFiles = (fileIds: string[]) => (dispatch: AppDispatch) => {
    fileIds.forEach(async (fileId) => {
        try {
            await db
                .collection("files")
                // .where("userId", "==", userId)
                .doc(fileId)
                .delete();
        } catch (error) {
            console.log(error);
        }
    });
    dispatch(__closeEditors(fileIds));
    dispatch(__deleteFiles(fileIds));
};

export const getItems = (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(__setLoading(true));
    dispatch(getFiles(userId));
    dispatch(getFolders(userId));
    dispatch(__setLoading(false));
};

export const selectItem =
    (selectedId: SelectedItem) => (dispatch: AppDispatch) => {
        dispatch(__selectItem(selectedId));
    };

export const setEditor = (itemId: string | null) => (dispatch: AppDispatch) => {
    dispatch(__setEditor(itemId));
};

export const openEditor = (itemId: string) => (dispatch: AppDispatch) => {
    dispatch(__openEditor(itemId));
};

export const closeEditors = (itemIds: string[]) => (dispatch: AppDispatch) => {
    dispatch(__closeEditors(itemIds));
};
