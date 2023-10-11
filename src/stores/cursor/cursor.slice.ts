import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { CreationType, CursorState, SelectedItem } from "@/types";
import { selectItem } from "../directory";

export const initialState: CursorState = {
    creationType: null,
    fileActionType: null,
    dashboardAction: null,
};

const cursorSlice = createSlice({
    name: "cursor",
    initialState,
    reducers: {
        setCreation: (state, { payload }: PayloadAction<CreationType>) => {
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

export const { setCreation, setFileAction, setDashboardAction } =
    cursorSlice.actions;
export default cursorSlice.reducer;
