import { ThunkDispatch, createAsyncThunk } from "@reduxjs/toolkit";

import { tableRows as sampleProjects } from "@/data";
import { projectsDB } from "@/lib/storage";
import { CreatedBy } from "./project";
import { ProjectState, projectSelector } from "./project.slice";
import { DirectoryState, deleteDirectoryAsync } from "../directory";

export const createProjectAsync = createAsyncThunk(
    "project/createProjectAsync",
    async ({ user, data }: { user: CreatedBy; data: any }) => {
        return await projectsDB.create({ ...data, createdBy: user });
    }
);

export const getProjectsAsync = createAsyncThunk(
    "project/getProjectsAsync",
    async (userId: string) => {
        const projects = await projectsDB.get(userId);
        return projects.concat(sampleProjects);
    }
);

export const deleteProjectsAsync = createAsyncThunk<
    string[],
    {
        userId: string;
        projectIds: string[];
    },
    {
        state: { project: ProjectState };
        dispatch: ThunkDispatch<DirectoryState, any, any>;
    }
>(
    "project/deleteProjectsAsync",
    async ({ projectIds }, { getState, dispatch }) => {
        await projectsDB.delete(projectIds);
        projectSelector
            .selectAll(getState().project)
            .filter(({ projectId }) => projectIds.includes(projectId))
            .forEach((project) => {
                dispatch(deleteDirectoryAsync({ project, itemId: "root" }));
            });
        return projectIds;
    }
);

export const renameProjectAsync = createAsyncThunk(
    "project/renameProjectAsync",
    async ({ projectId, name }: { projectId: string; name: string }) => {
        await projectsDB.update(projectId, { name });
        return { id: projectId, changes: { name } };
    }
);
