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

        /** folders */
        case FileActionTypes.CREATE_FOLDER:
            return { ...state, userFolders: [...state.userFolders, payload] };
        case FileActionTypes.GET_FOLDERS:
            return { ...state, userFolders: payload };
        case FileActionTypes.DELETE_FOLDERS:
            const userFolders = state.userFolders.filter(
                ({ itemId }) => !payload.includes(itemId)
            );
            return { ...state, userFolders };

        /** files */
        case FileActionTypes.CREATE_FILE:
            return { ...state, userFiles: [...state.userFiles, payload] };
        case FileActionTypes.GET_FILES:
            return { ...state, userFiles: payload };
        case FileActionTypes.DELETE_FILES:
            const userFiles = state.userFiles.filter(
                ({ itemId }) => !payload.includes(itemId)
            );
            return { ...state, userFiles };

        /** selected folder/file */
        case FileActionTypes.SELECT_ITEM:
            return { ...state, currentItem: payload };

        /** editors */
        case FileActionTypes.SET_EDITOR:
            return { ...state, currentEditor: payload };
        case FileActionTypes.OPEN_EDITOR:
            if (!state.editors.includes(payload)) {
                state.editors.push(payload);
            }
            return { ...state, editors: state.editors, currentEditor: payload };
        case FileActionTypes.CLOSE_EDITORS:
            const editors = state.editors.filter(
                (itemId) => !payload.includes(itemId)
            );
            return { ...state, editors, currentEditor: editors.at(0) ?? null };

        /** default */
        default:
            return state;
    }
};
export default fileReducer;
