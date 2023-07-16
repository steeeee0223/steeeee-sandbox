import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

import { Editor } from "./editor";
import {
    File,
    createFileAsync,
    deleteDirectoryAsync,
    uploadFileAsync,
} from "@/stores/directory";
import { setProject } from "../project";

export const editorAdapter = createEntityAdapter<Editor>();

const initialState = editorAdapter.getInitialState<{
    currentEditor: string | null;
}>({
    currentEditor: null,
});

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setEditor: (state, { payload }: PayloadAction<string>) => {
            state.currentEditor = payload;
        },
        openEditor: (state, { payload }: PayloadAction<string>) => {
            editorAdapter.addOne(state, { id: payload });
            state.currentEditor = payload;
        },
        closeEditors: (state, { payload }: PayloadAction<string[]>) => {
            editorAdapter.removeMany(state, payload);
            const editorIds = editorAdapter.getSelectors().selectIds(state);
            state.currentEditor = editorIds.at(0)?.toString() ?? null;
        },
    },
    extraReducers(builder) {
        builder.addCase(
            createFileAsync.fulfilled || uploadFileAsync.fulfilled,
            (state, { payload }: PayloadAction<File>) => {
                const { itemId } = payload;
                editorAdapter.addOne(state, { id: itemId });
                state.currentEditor = itemId;
            }
        );
        builder.addCase(
            deleteDirectoryAsync.fulfilled,
            (state, { payload }: PayloadAction<string[]>) => {
                editorAdapter.removeMany(state, payload);
                const editorIds = editorAdapter.getSelectors().selectIds(state);
                state.currentEditor = editorIds.at(0)?.toString() ?? null;
            }
        );
        builder.addCase(setProject, (state) => {
            state.currentEditor = null;
            editorAdapter.removeAll(state);
        });
    },
});

export type EditorState = typeof initialState;
export const editorSelector = editorAdapter.getSelectors(
    (state: EditorState) => state
);

export const { setEditor, openEditor, closeEditors } = editorSlice.actions;
export default editorSlice.reducer;
