import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { User } from "firebase/auth";

import { setLoading } from "@/stores/directory";
import { Project, SelectedProject, projectSelector } from "@/stores/project";

import { useAuth } from "./auth";
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
    getProjectTemplate: (projectId: string) => string;
}

export const useProjects = (): ProjectsInfo & ProjectsOperations => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const {
        projectState,
        currentProject,
        projectIsLoading,
        directoryIsLoading,
    } = useAppSelector(
        (state) => ({
            projectState: state.project,
            currentProject: state.project.currentProject,
            projectIsLoading: state.project.isLoading,
            directoryIsLoading: state.directory.isLoading,
        }),
        shallowEqual
    );
    const projects = projectSelector.selectAll(projectState);
    const projectIds = projectSelector.selectIds(projectState) as string[];
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

    useEffect(() => {
        if (user && currentProject) {
            dispatch(setLoading());
        }
    }, [user, currentProject]);

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
        getProjectTemplate,
    };
};
