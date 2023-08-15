import { createAsyncThunk, Update } from "@reduxjs/toolkit";
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

import { tableRows as sampleProjects } from "@/data";
import { getRefId } from "@/lib/file";
import { filesDB, fireStoreDB, foldersDB, projectsDB } from "@/lib/storage";
import { CreatedBy, Project } from "./project";
import { ProjectState, projectSelector } from "./project.slice";
import { configureTemplateAsync } from "../directory";

export const createProjectAsync = createAsyncThunk<
    Project,
    { user: CreatedBy; data: any }
>("project/createProjectAsync", async ({ user, data }, { dispatch }) => {
    const project = await projectsDB.create({ ...data, createdBy: user });

    /** Fetch default files from Sandpack templates */
    const { SANDBOX_TEMPLATES } = await import("@codesandbox/sandpack-react");
    const { files } =
        SANDBOX_TEMPLATES[data.template as SandpackPredefinedTemplate];

    /** @ts-ignore */
    dispatch(configureTemplateAsync({ project, files }));
    return project;
});

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
            const refPath = getRefId(project);
            await fireStoreDB.deleteAll(refPath);
        });

    return projectIds;
});

export const renameProjectAsync = createAsyncThunk<
    Update<Project>,
    { projectId: string; name: string },
    {
        state: { project: ProjectState };
    }
>("project/renameProjectAsync", async ({ projectId, name }, { getState }) => {
    await projectsDB.update(projectId, { name });

    const { name: srcName } =
        projectSelector.selectById(getState().project, projectId) ??
        (undefined as never);
    await fireStoreDB.rename(
        `${srcName}-${projectId}`,
        `${name}-${projectId}`,
        true
    );
    return { id: projectId, changes: { name } };
});
