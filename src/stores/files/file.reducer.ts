import { PayloadAction } from "@reduxjs/toolkit";

import { FileActionTypes, FileState } from "@/stores/files/file.types";

const initialState: FileState = {
    isLoading: true,
    creationType: null,
    actionType: null,
    currentItem: {
        item: { id: "root", name: "root", isFolder: true },
        path: { id: [], name: [] },
    },
    currentEditor: null,
    editors: [],
    userFolders: [],
    userFiles: [],
    adminFolders: [],
    adminFiles: [],
};

const fileReducer = (
    state: FileState = initialState,
    { type, payload }: PayloadAction<any, FileActionTypes>
): FileState => {
    switch (type) {
        case FileActionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: payload,
            };
        case FileActionTypes.SET_ACTION:
            return { ...state, actionType: payload };
        case FileActionTypes.SET_CREATION:
            return { ...state, creationType: payload };
        case FileActionTypes.CREATE_FOLDER:
            return { ...state, userFolders: [...state.userFolders, payload] };
        case FileActionTypes.GET_FOLDERS:
            return { ...state, userFolders: payload };
        case FileActionTypes.CREATE_FILE:
            return { ...state, userFiles: [...state.userFiles, payload] };
        case FileActionTypes.GET_FILES:
            return { ...state, userFiles: payload };
        case FileActionTypes.SELECT_ITEM:
            return { ...state, currentItem: payload };
        case FileActionTypes.OPEN_EDITOR:
            return {
                ...state,
                currentEditor: payload,
                editors: [...state.editors, payload],
            };
        case FileActionTypes.CLOSE_EDITOR:
            const editors = state.editors.filter(
                (itemId) => itemId !== payload
            );
            const currentEditor = editors.at(0) ?? null;
            return { ...state, editors, currentEditor };
        default:
            return state;
    }
};
export default fileReducer;
