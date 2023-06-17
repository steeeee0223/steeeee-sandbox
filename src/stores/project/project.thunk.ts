import { createAsyncThunk } from "@reduxjs/toolkit";

import { tableRows as sampleProjects } from "@/data";
import { filesDB, foldersDB, projectsDB } from "@/lib/storage";

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
    async ({
        userId,
        projectIds,
    }: {
        userId: string;
        projectIds: string[];
    }) => {
        await projectsDB.delete(projectIds);
        projectIds.forEach(async (projectId) => {
            const folderIds = (await foldersDB.get({ userId, projectId })).map(
                ({ itemId }) => itemId
            );
            await foldersDB.delete(folderIds);
            const fileIds = (await filesDB.get({ userId, projectId })).map(
                ({ itemId }) => itemId
            );
            await filesDB.delete(fileIds);
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
