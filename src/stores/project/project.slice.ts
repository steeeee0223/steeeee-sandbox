import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
} from "@reduxjs/toolkit";

import { Project, SelectedProject } from "./project";
import {
    createProjectAsync,
    deleteProjectsAsync,
    getProjectsAsync,
    renameProjectAsync,
} from "./project.thunk";

export const projectAdapter = createEntityAdapter<Project>({
    selectId: (project) => project.projectId,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const initialState = projectAdapter.getInitialState<{
    isLoading: boolean;
    currentProject: SelectedProject | null;
}>({
    isLoading: true,
    currentProject: null,
});

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
    extraReducers(builder) {
        builder.addCase(createProjectAsync.fulfilled, projectAdapter.addOne);
        builder.addCase(
            getProjectsAsync.fulfilled,
            (state, { payload }: PayloadAction<Project[]>) => {
                projectAdapter.setAll(state, payload);
                state.isLoading = false;
            }
        );
        builder.addCase(
            deleteProjectsAsync.fulfilled,
            projectAdapter.removeMany
        );
        builder.addCase(renameProjectAsync.fulfilled, projectAdapter.updateOne);
    },
});

export type ProjectState = typeof initialState;
export const projectSelector = projectAdapter.getSelectors(
    (state: ProjectState) => state
);

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;
