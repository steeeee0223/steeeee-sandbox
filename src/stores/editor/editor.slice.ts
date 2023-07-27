import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

import {
    File,
    createFileAsync,
    deleteDirectoryAsync,
    updateFileAsync,
    uploadFileAsync,
} from "@/stores/directory";
import { Editor } from "./editor";
import { setProject } from "../project";

export const editorAdapter = createEntityAdapter<Editor>();

const initialState = editorAdapter.getInitialState<{
    currentEditor: string | null;
    currentText: string;
}>({
    currentEditor: null,
    currentText: "",
});

export type EditorState = typeof initialState;

const __addFile = (state: EditorState, { payload }: PayloadAction<File>) => {
    console.log(`[Slice] action: __addFile`);
    const { itemId, name, extension, content } = payload;
    editorAdapter.addOne(state, { id: itemId, name, content, extension });
};

const __updateCurrentEditor = (state: EditorState) => {
    console.log(`[Slice] action: __updateCurrentEditor`);
    if (state.currentEditor)
        editorAdapter.updateOne(state, {
            id: state.currentEditor,
            changes: { content: state.currentText },
        });
};

const __setEditor = (
    state: EditorState,
    { payload }: PayloadAction<string | null>
) => {
    /** Set `currentEditor` to new one `editorId` */
    console.log(`[Slice] action: __setEditor`);
    state.currentEditor = payload;

    /** Update `currentText` to content of `editorId` */
    if (!payload) {
        state.currentText = "";
    } else {
        state.currentText = state.entities[payload]?.content ?? "";
    }
};

const __openEditor = (state: EditorState, { payload }: PayloadAction<File>) => {
    console.log(`[Slice] action: __openEditor`);
    __addFile(state, { payload, type: "editor/addFile" });
    __setEditor(state, {
        payload: payload.itemId,
        type: "editor/setEditor",
    });
};

const __closeEditors = (
    state: EditorState,
    { payload }: PayloadAction<string[]>
) => {
    /** Remove editors */
    console.log(`[Slice] action: __closeEditors`);
    editorAdapter.removeMany(state, payload);
    state.currentEditor = null;

    /** Select new editor */
    const editorIds = editorAdapter.getSelectors().selectIds(state) as string[];
    __setEditor(state, {
        payload: editorIds.at(0) ?? null,
        type: "editor/setEditor",
    });
};

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setEditor: (state, action) => {
            __updateCurrentEditor(state);
            __setEditor(state, action);
        },
        openEditor: __addFile,
        closeEditors: (state, action) => {
            __updateCurrentEditor(state);
            __closeEditors(state, action);
        },
        updateEditor: editorAdapter.updateOne,
        updateCurrentEditor: __updateCurrentEditor,
        updateText: (state, { payload }: PayloadAction<string>) => {
            state.currentText = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(createFileAsync.fulfilled, __openEditor);
        builder.addCase(uploadFileAsync.fulfilled, __openEditor);
        builder.addCase(updateFileAsync.fulfilled, editorAdapter.updateOne);
        builder.addCase(deleteDirectoryAsync.fulfilled, (state, action) => {
            __updateCurrentEditor(state);
            __closeEditors(state, action);
        });
        builder.addCase(setProject, (state) => {
            __setEditor(state, { payload: null, type: "editor/setEditor" });
            editorAdapter.removeAll(state);
        });
    },
});

export const editorSelector = editorAdapter.getSelectors(
    (state: EditorState) => state
);

export const {
    setEditor,
    openEditor,
    closeEditors,
    updateEditor,
    updateText,
    updateCurrentEditor,
} = editorSlice.actions;
export default editorSlice.reducer;
