import { PayloadAction } from "@reduxjs/toolkit";
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
    DELETE_FOLDERS = "DELETE_FOLDERS",
    CREATE_FILE = "CREATE_FILE",
    GET_FILES = "GET_FILES",
    DELETE_FILES = "DELETE_FILES",
    SELECT_ITEM = "SELECT_ITEM", // select item: folder | file
    SET_EDITOR = "SET_EDITOR",
    OPEN_EDITOR = "OPEN_EDITOR",
    CLOSE_EDITORS = "CLOSE_EDITORS",
}

export type FileActionPayload =
    | {
          type: FileActionTypes.SET_LOADING;
          payload: boolean;
      }
    | {
          type:
              | FileActionTypes.SET_CREATION
              | FileActionTypes.SET_ACTION
              | FileActionTypes.SET_EDITOR;
          payload: string | null;
      }
    | {
          type: FileActionTypes.CREATE_FOLDER;
          payload: Folder;
      }
    | {
          type: FileActionTypes.GET_FOLDERS;
          payload: Folder[];
      }
    | {
          type: FileActionTypes.CREATE_FILE;
          payload: File;
      }
    | {
          type: FileActionTypes.GET_FILES;
          payload: File[];
      }
    | {
          type:
              | FileActionTypes.DELETE_FOLDERS
              | FileActionTypes.DELETE_FILES
              | FileActionTypes.CLOSE_EDITORS;
          payload: string[];
      }
    | {
          type: FileActionTypes.OPEN_EDITOR;
          payload: string;
      }
    | {
          type: FileActionTypes.SELECT_ITEM;
          payload: SelectedItem;
      };
export interface IFileAction extends PayloadAction<any, FileActionTypes> {}
