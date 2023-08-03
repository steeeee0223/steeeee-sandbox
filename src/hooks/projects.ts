import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { User } from "firebase/auth";

import { setLoading } from "@/stores/directory";
import {
    Project,
    ProjectAction,
    SelectedProject,
    getProjectsAsync,
    projectSelector,
    setProject,
} from "@/stores/project";

import { useAppDispatch, useAppSelector } from "./stores";

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
    getProject: (projectId: string) => Project | undefined;
    getProjectTemplate: (projectId: string) => string;
    selectProject: (id: string, action: ProjectAction) => void;
    resetProject: () => void;
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
    const getProject = (projectId: string) =>
        projectSelector.selectById(projectState, projectId);
    const getProjectTemplate = (projectId: string) =>
        projectSelector.selectById(projectState, projectId)?.template ??
        "static";
    const isProjectOfUser = (id: string | null | undefined) =>
        !!id && projectIds.includes(id);
    const isProjectPresent = (projectName: string) =>
        !!projects.find(({ name }) => projectName === name);
    const isProjectMatch = (projectName: string, id: string) =>
        !!projects.find(
            ({ name, projectId }) => name === projectName && projectId === id
        );

    const selectProject = (id: string, action: ProjectAction) => {
        console.log(`[useProjects] id ${id} => ${action}`);
        dispatch(setProject({ id, action }));
    };
    const resetProject = () => {
        console.log(`[useProjects] id  => null`);
        dispatch(setProject(null));
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
        getProject,
        getProjectTemplate,
        selectProject,
        resetProject,
    };
};
