import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

import { DirectoryItem, SelectedItem } from "./directory";
import {
    createFileAsync,
    createFolderAsync,
    deleteDirectoryAsync,
    getDirectoryAsync,
    renameDirectoryItemAsync,
    updateFileAsync,
    uploadFileAsync,
} from "./directory.thunk";

export const directoryAdapter = createEntityAdapter<DirectoryItem>({
    selectId: (item) => item.itemId,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = directoryAdapter.getInitialState<{
    isLoading: boolean;
    currentItem: SelectedItem;
}>({
    isLoading: true,
    currentItem: {
        item: { id: "root", name: "root", isFolder: true },
        path: { id: [], name: [] },
    },
});

const directorySlice = createSlice({
    name: "directory",
    initialState,
    reducers: {
        selectItem: (state, { payload }: PayloadAction<SelectedItem>) => {
            state.currentItem = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(createFolderAsync.fulfilled, directoryAdapter.addOne);
        builder.addCase(createFileAsync.fulfilled, directoryAdapter.addOne);
        builder.addCase(uploadFileAsync.fulfilled, directoryAdapter.addOne);
        builder.addCase(getDirectoryAsync.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(
            getDirectoryAsync.fulfilled,
            (state, { payload }: PayloadAction<DirectoryItem[]>) => {
                directoryAdapter.setAll(state, payload);
                state.isLoading = false;
            }
        );
        builder.addCase(
            deleteDirectoryAsync.fulfilled,
            directoryAdapter.removeMany
        );
        builder.addCase(
            renameDirectoryItemAsync.fulfilled,
            directoryAdapter.updateOne
        );
        builder.addCase(updateFileAsync.fulfilled, directoryAdapter.updateOne);
    },
});

export type DirectoryState = typeof initialState;
export const directorySelector = directoryAdapter.getSelectors(
    (state: DirectoryState) => state
);

export const { selectItem } = directorySlice.actions;
export default directorySlice.reducer;
