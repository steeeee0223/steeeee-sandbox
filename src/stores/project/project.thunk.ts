import { createAsyncThunk } from "@reduxjs/toolkit";

import { ProjectStorage } from "@/lib/storage";
import { tableRows as sampleProjects } from "@/data";

const projectsDB = ProjectStorage.getStorage();

export const createProjectAsync = createAsyncThunk(
    "project/createProjectAsync",
    async ({ userId, data }: { userId: string; data: any }) => {
        return await projectsDB.create({ ...data, createdBy: userId });
    }
);

export const getProjectsAsync = createAsyncThunk(
    "project/getProjectsAsync",
    async (userId: string) => {
        const projects = await projectsDB.get(userId);
        return projects.concat(sampleProjects);
    }
);

export const deleteProjectsAsync = createAsyncThunk(
    "project/deleteProjectsAsync",
    async (projectIds: string[]) => {
        await projectsDB.delete(projectIds);
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
