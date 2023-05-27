import { FileActionPayload, FileActionTypes } from "@/stores/files/file.types";
import { SelectedItem } from "@/components/project";
import { accordion as sampleFolders, children as sampleFiles } from "@/data";
import { AppDispatch } from "@/hooks";
import { FilesStorage, FoldersStorage } from "@/lib/storage";

const __setLoading = (payload: boolean): FileActionPayload => ({
    type: FileActionTypes.SET_LOADING,
    payload,
});
const __openEditor = (payload: string): FileActionPayload => ({
    type: FileActionTypes.OPEN_EDITOR,
    payload,
});
const __closeEditors = (payload: string[]): FileActionPayload => ({
    type: FileActionTypes.CLOSE_EDITORS,
    payload,
});

export const setCreation =
    (creationType: string | null) => (dispatch: AppDispatch) => {
        dispatch({ type: FileActionTypes.SET_CREATION, payload: creationType });
    };

export const setFileAction =
    (actionType: string | null) => (dispatch: AppDispatch) => {
        dispatch({ type: FileActionTypes.SET_ACTION, payload: actionType });
    };

export const createFolder = (data: any) => async (dispatch: AppDispatch) => {
    const storage = FoldersStorage.getStorage();
    const folder = await storage.create(data);
    dispatch({ type: FileActionTypes.CREATE_FOLDER, payload: folder });
};

export const getFolders = (userId: string) => async (dispatch: AppDispatch) => {
    const storage = FoldersStorage.getStorage();
    const items = await storage.get(userId);
    /** with default folders */
    sampleFolders.push(...items);
    dispatch({ type: FileActionTypes.GET_FOLDERS, payload: sampleFolders });
};

export const deleteFolders =
    (folderIds: string[]) => (dispatch: AppDispatch) => {
        const storage = FoldersStorage.getStorage();
        storage.delete(folderIds);
        dispatch({ type: FileActionTypes.DELETE_FOLDERS, payload: folderIds });
    };

export const createFile = (data: any) => async (dispatch: AppDispatch) => {
    const storage = FilesStorage.getStorage();
    const file = await storage.create(data);
    dispatch({ type: FileActionTypes.CREATE_FILE, payload: file });
    dispatch(__openEditor(file.itemId));
};

export const getFiles = (userId: string) => async (dispatch: AppDispatch) => {
    const storage = FilesStorage.getStorage();
    const items = await storage.get(userId);
    /** with default files */
    sampleFiles.push(...items);
    dispatch({ type: FileActionTypes.GET_FILES, payload: sampleFiles });
};

export const deleteFiles = (fileIds: string[]) => (dispatch: AppDispatch) => {
    const storage = FilesStorage.getStorage();
    storage.delete(fileIds);
    dispatch(__closeEditors(fileIds));
    dispatch({ type: FileActionTypes.DELETE_FILES, payload: fileIds });
};

export const getItems = (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(__setLoading(true));
    dispatch(getFiles(userId));
    dispatch(getFolders(userId));
    dispatch(__setLoading(false));
};

export const selectItem =
    (selectedId: SelectedItem) => (dispatch: AppDispatch) => {
        dispatch({ type: FileActionTypes.SELECT_ITEM, payload: selectedId });
    };

export const setEditor = (itemId: string | null) => (dispatch: AppDispatch) => {
    dispatch({ type: FileActionTypes.SET_EDITOR, payload: itemId });
};

export const openEditor = (itemId: string) => (dispatch: AppDispatch) => {
    dispatch(__openEditor(itemId));
};

export const closeEditors = (itemIds: string[]) => (dispatch: AppDispatch) => {
    dispatch(__closeEditors(itemIds));
};
