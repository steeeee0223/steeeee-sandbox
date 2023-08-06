import { createAsyncThunk } from "@reduxjs/toolkit";

import { tableRows as sampleProjects } from "@/data";
import { getRefId } from "@/lib/file";
import { filesDB, fireStoreDB, foldersDB, projectsDB } from "@/lib/storage";
import { CreatedBy } from "./project";
import { ProjectState, projectSelector } from "./project.slice";

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
    }
>("project/deleteProjectsAsync", async ({ projectIds }, { getState }) => {
    await projectsDB.delete(projectIds);
    projectSelector
        .selectAll(getState().project)
        .filter(({ projectId }) => projectIds.includes(projectId))
        .forEach(async (project) => {
            const { projectId } = project;

            /** delete folders from Firebase */
            const folderIds = (await foldersDB.get({ projectId })).map(
                ({ itemId }) => itemId
            );
            await foldersDB.delete(folderIds);

            /** delete files from Firebase */
            const files = await filesDB.get({ projectId });
            const fileIds = files.map(({ itemId }) => itemId);
            await filesDB.delete(fileIds);

            /** delete files from FireStore */
            const refIds = files.map((file) => getRefId(project, file));
            await fireStoreDB.delete(refIds);
        });

    return projectIds;
});

export const renameProjectAsync = createAsyncThunk(
    "project/renameProjectAsync",
    async ({ projectId, name }: { projectId: string; name: string }) => {
        await projectsDB.update(projectId, { name });
        return { id: projectId, changes: { name } };
    }
);
