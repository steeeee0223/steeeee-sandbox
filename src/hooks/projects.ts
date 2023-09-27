import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { User } from "firebase/auth";

import { downloadDirectoryAsync, setLoading } from "@/stores/directory";
import {
    Project,
    ProjectAction,
    SelectedProject,
    createProjectAsync,
    deleteProjectsAsync,
    getProjectsAsync,
    projectSelector,
    renameProjectAsync,
    setProject,
} from "@/stores/project";

import { useAppDispatch, useAppSelector } from "./stores";
import { projectTemplates } from "@/data";
import { setDashboardAction } from "@/stores/cursor";

interface ProjectsInfo {
    user: User | null;
    currentProject: SelectedProject | null;
    projects: Project[];
    projectIds: string[];
    projectIsLoading: boolean;
    directoryIsLoading: boolean;
}

interface ProjectsOperations {
    isProjectOfUser: (id: string | null | undefined) => boolean;
    isProjectPresent: (projectName: string) => boolean;
    isProjectMatch: (projectName: string, id: string) => boolean;
    getById: (projectId: string) => Project | undefined;
    create: (name: string, template: string, onSuccess?: Function) => void;
    rename: (projectId: string, name: string) => void;
    deleteMany: (projectIds: string[], onSuccess?: Function) => void;
    select: (id: string, action: ProjectAction) => void;
    reset: () => void;
    download: (projectId: string) => void;
}

export const useProjects = (): ProjectsInfo & ProjectsOperations => {
    const dispatch = useAppDispatch();
    const {
        user,
        projectState,
        currentProject,
        projectIsLoading,
        directoryIsLoading,
    } = useAppSelector(
        (state) => ({
            user: state.auth.user,
            projectState: state.project,
            currentProject: state.project.currentProject,
            projectIsLoading: state.project.isLoading,
            directoryIsLoading: state.directory.isLoading,
        }),
        shallowEqual
    );
    const projects = projectSelector.selectAll(projectState);
    const projectIds = projectSelector.selectIds(projectState) as string[];
    const getById: ProjectsOperations["getById"] = (projectId) =>
        projectSelector.selectById(projectState, projectId);
    const isProjectOfUser: ProjectsOperations["isProjectOfUser"] = (id) =>
        !!id && projectIds.includes(id);
    const isProjectPresent: ProjectsOperations["isProjectPresent"] = (
        projectName
    ) => !!projects.find(({ name }) => projectName === name);
    const isProjectMatch: ProjectsOperations["isProjectMatch"] = (
        projectName,
        id
    ) =>
        !!projects.find(
            ({ name, projectId }) => name === projectName && projectId === id
        );

    const select: ProjectsOperations["select"] = (id, action) => {
        console.log(`[useProjects] id ${id} => ${action}`);
        dispatch(setProject({ id, action }));
    };
    const reset: ProjectsOperations["reset"] = () => {
        console.log(`[useProjects] id  => null`);
        dispatch(setProject(null));
    };
    const create: ProjectsOperations["create"] = (
        name,
        template,
        onSuccess
    ) => {
        if (user) {
            const { uid, displayName, email } = user;
            const { label } = projectTemplates.find(
                ({ value }) => value === template
            )!;
            const data = {
                createdAt: new Date(),
                lastModifiedAt: new Date(),
                template,
                name,
                tags: [label],
            };
            dispatch(
                createProjectAsync({
                    user: { uid, displayName, email },
                    data,
                })
            );
            dispatch(setDashboardAction(null));
            if (onSuccess) onSuccess();
        }
    };
    const rename: ProjectsOperations["rename"] = (projectId, name) =>
        dispatch(renameProjectAsync({ projectId, name }));
    const deleteMany: ProjectsOperations["deleteMany"] = (
        projectIds,
        onSuccess
    ) => {
        if (user) {
            dispatch(deleteProjectsAsync({ userId: user.uid, projectIds }));
            reset();
            if (onSuccess) onSuccess();
        }
    };
    const download: ProjectsOperations["download"] = (projectId) => {
        const project = getById(projectId);
        if (project) dispatch(downloadDirectoryAsync({ project }));
    };

    useEffect(() => {
        if (user && currentProject) {
            dispatch(setLoading());
        }
    }, [user, currentProject]);

    useEffect(() => {
        if (user) dispatch(getProjectsAsync(user.uid));
    }, [user]);

    return {
        user,
        currentProject,
        projects,
        projectIds,
        projectIsLoading,
        directoryIsLoading,
        isProjectOfUser,
        isProjectPresent,
        isProjectMatch,
        getById,
        create,
        rename,
        deleteMany,
        select,
        reset,
        download,
    };
};
