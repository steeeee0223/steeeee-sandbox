import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

import { CopiedItems, DirectoryItem, SelectedItem } from "./directory";
import {
    createFileAsync,
    createFolderAsync,
    deleteDirectoryAsync,
    getDirectoryAsync,
    renameDirectoryItemAsync,
    updateFileAsync,
    uploadFileAsync,
} from "./directory.thunk";
import { setProject } from "../project";

export const directoryAdapter = createEntityAdapter<DirectoryItem>({
    selectId: (item) => item.itemId,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const rootItem: SelectedItem = {
    item: { id: "root", name: "root", isFolder: true },
    path: { id: [], name: [] },
};

const initialState = directoryAdapter.getInitialState<{
    isLoading: boolean;
    currentItem: SelectedItem;
    copiedItems: CopiedItems | null;
}>({
    isLoading: true,
    currentItem: rootItem,
    copiedItems: null,
});
export type DirectoryState = typeof initialState;

const __setLoading = (state: DirectoryState) => {
    state.isLoading = true;
};

const directorySlice = createSlice({
    name: "directory",
    initialState,
    reducers: {
        setLoading: __setLoading,
        selectItem: (state, { payload }: PayloadAction<SelectedItem>) => {
            state.currentItem = payload;
        },
        copyItems: (state, { payload }: PayloadAction<CopiedItems | null>) => {
            state.copiedItems = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(setProject, (state) => {
            directoryAdapter.removeAll(state);
            state.currentItem = rootItem;
        });
        builder.addCase(createFolderAsync.fulfilled, directoryAdapter.addOne);
        builder.addCase(createFolderAsync.rejected, __setLoading);
        builder.addCase(createFileAsync.fulfilled, directoryAdapter.addOne);
        builder.addCase(createFileAsync.rejected, __setLoading);
        builder.addCase(uploadFileAsync.fulfilled, directoryAdapter.addOne);
        builder.addCase(uploadFileAsync.rejected, __setLoading);
        builder.addCase(getDirectoryAsync.pending, __setLoading);
        builder.addCase(
            getDirectoryAsync.fulfilled,
            (state, { payload }: PayloadAction<DirectoryItem[]>) => {
                directoryAdapter.setAll(state, payload);
                state.isLoading = false;
            }
        );
        builder.addCase(
            renameDirectoryItemAsync.fulfilled,
            directoryAdapter.updateOne
        );
        builder.addCase(updateFileAsync.fulfilled, directoryAdapter.updateOne);
        builder.addCase(
            deleteDirectoryAsync.fulfilled,
            (state, { payload }) => {
                directoryAdapter.removeMany(state, payload);
                state.currentItem = rootItem;
            }
        );
    },
});

export const directorySelector = directoryAdapter.getSelectors(
    (state: DirectoryState) => state
);

export const { setLoading, selectItem, copyItems } = directorySlice.actions;
export default directorySlice.reducer;
