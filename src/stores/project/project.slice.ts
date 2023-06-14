import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

import { Project, SelectedProject } from "./project";

export const projectAdapter = createEntityAdapter<Project>();

const initialState = projectAdapter.getInitialState<{
    currentProject: SelectedProject | null;
}>({ currentProject: null });

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProject: (
            state,
            { payload }: PayloadAction<SelectedProject | null>
        ) => {
            state.currentProject = payload;
        },
    },
    extraReducers(builder) {},
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;
