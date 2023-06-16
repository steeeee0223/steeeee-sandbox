import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { SelectedItem, selectItem } from "../directory";
import { CursorState } from "./cursor";

const initialState: CursorState = {
    renameItem: null,
    creationType: null,
    fileActionType: null,
    dashboardAction: null,
};

const cursorSlice = createSlice({
    name: "cursor",
    initialState,
    reducers: {
        setRenameItem: (state, { payload }: PayloadAction<string | null>) => {
            state.renameItem = payload;
        },
        setCreation: (state, { payload }: PayloadAction<string | null>) => {
            state.creationType = payload;
        },
        setFileAction: (state, { payload }: PayloadAction<string | null>) => {
            state.fileActionType = payload;
        },
        setDashboardAction: (
            state,
            { payload }: PayloadAction<typeof state.dashboardAction>
        ) => {
            state.dashboardAction = payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(
            selectItem,
            (state, { payload }: PayloadAction<SelectedItem>) => {
                if (!payload.item.isFolder) {
                    state.creationType = null;
                }
            }
        );
    },
});

export const { setRenameItem, setCreation, setFileAction, setDashboardAction } =
    cursorSlice.actions;
export default cursorSlice.reducer;
