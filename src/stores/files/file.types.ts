import { File, Folder, SelectedItem } from "@/components/project";

export interface FileState {
    isLoading: boolean;
    creationType: string | null;
    actionType: string | null;
    currentItem: SelectedItem;
    currentEditor: string | null;
    editors: string[];
    userFolders: Folder[];
    userFiles: File[];
    adminFolders: Folder[];
    adminFiles: File[];
}

export enum FileActionTypes {
    SET_LOADING = "SET_LOADING",
    SET_ACTION = "SET_ACTION", // sets action types: save | download | copy
    SET_CREATION = "SET_CREATION", // sets creation types: folder | file | upload
    CREATE_FOLDER = "CREATE_FOLDER",
    GET_FOLDERS = "GET_FOLDERS",
    CREATE_FILE = "CREATE_FILE",
    GET_FILES = "GET_FILES",
    SELECT_ITEM = "SELECT_ITEM", // select item: folder | file
    OPEN_EDITOR = "OPEN_EDITOR",
    CLOSE_EDITOR = "CLOSE_EDITOR",
}
