import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { User } from "firebase/auth";

import { setDashboardAction } from "@/stores/cursor";
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

interface ProjectsInfo {
    user: User | null;
    currentProject: SelectedProject | null;
    projects: Project[];
    projectIds: string[];
    projectIsLoading: boolean;
    directoryIsLoading: boolean;
    isProjectOfUser: (id: string | null | undefined) => boolean;
    isProjectPresent: (projectName: string) => boolean;
    isProjectMatch: (projectName: string, id: string) => boolean;
}

interface ProjectsOperations {
    getAll: () => void;
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
    /** Info */
    const projects: Project[] = projectSelector.selectAll(projectState);
    const projectIds = projectSelector.selectIds(projectState) as string[];
    const info: ProjectsInfo = {
        user,
        projects,
        projectIds,
        currentProject,
        projectIsLoading,
        directoryIsLoading,
        isProjectOfUser: (id) => !!id && projectIds.includes(id),
        isProjectPresent: (projectName) =>
            !!projects.find(({ name }) => projectName === name),
        isProjectMatch: (projectName, id) =>
            !!projects.find(
                ({ name, projectId }) =>
                    name === projectName && projectId === id
            ),
    };

    /** Operations */
    const getAll: ProjectsOperations["getAll"] = () => {
        if (user) dispatch(getProjectsAsync(user.uid));
    };
    const getById: ProjectsOperations["getById"] = (projectId) =>
        projectSelector.selectById(projectState, projectId);

    const reset = () => {
        console.log(`[useProjects] id  => null`);
        dispatch(setProject(null));
    };

    const operations: ProjectsOperations = {
        getAll,
        getById,
        select: (id, action) => {
            console.log(`[useProjects] id ${id} => ${action}`);
            dispatch(setProject({ id, action }));
        },
        reset,
        create: (name, template, onSuccess) => {
            if (!user) return;
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
        },
        rename: (projectId, name) =>
            dispatch(renameProjectAsync({ projectId, name })),
        deleteMany: (projectIds, onSuccess) => {
            if (!user) return;
            dispatch(deleteProjectsAsync({ userId: user.uid, projectIds }));
            reset();
            if (onSuccess) onSuccess();
        },
        download: (projectId) => {
            if (!user) return;
            const project = getById(projectId);
            if (project) dispatch(downloadDirectoryAsync({ project }));
        },
    };

    useEffect(() => {
        if (user && currentProject) {
            dispatch(setLoading());
        }
    }, [user, currentProject]);

    useEffect(() => {
        getAll();
    }, [user]);

    return { ...info, ...operations };
};
